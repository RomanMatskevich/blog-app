import { CardMedia } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import Link from "next/link";
import { ChangeEvent, useReducer, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Editor as TinyMCEEditor } from "tinymce";
import { postReducer } from "@/reducers/postReducer";
import { useRouter } from "next/router";

const initialState = {
  title: {
    value: "",
    error: null,
  },
  description: {
    value: "",
    error: null,
  },
  image: {
    value: null,
    error: null,
  },
};

export default function CreatePost() {
  const [stateForm, dispatch] = useReducer(postReducer, initialState);
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const router = useRouter()
  console.log(stateForm);
  function setTitle(e: ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: "set_name",
      value: e.target.value,
    });
  }
  function setDescription() {
    editorRef.current &&
      dispatch({
        type: "set_description",
        value: editorRef.current.getContent(),
      });
  }
  function setImage(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    dispatch({
      type: "set_image",
      value: file,
    });
  }
  async function createPost() {
    dispatch({
      type: "validate_title",
      value: "",
    });
    dispatch({
      type: "validate_description",
      value: "",
    });
    dispatch({
      type: "validate_image",
      value: "",
    });
    stateForm.title.error && toast.error(stateForm.title.error);
    stateForm.description.error && toast.error(stateForm.description.error);
    stateForm.image.error && toast.error(stateForm.image.error);
    if (
      stateForm.title.error ||
      stateForm.description.error ||
      stateForm.image.error ||
      !stateForm.image.value
    ) {
      return;
    }
    const formData = new FormData();
    formData.append("image", stateForm.image.value);
    formData.append("title", stateForm.title.value);
    formData.append("description", stateForm.description.value);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SERVER_URI + "/post/create",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }
        console.error("Error response:", errorData);
        const errors = errorData.message || [errorData];
        errors.forEach((error: string) => toast.error(error));
        throw new Error("Request failed");
      }
      const post = await response.json();
      toast.success("Post created");
      router.push(`/post/${post._id}`)
    } catch (e: any) {
      console.error(e.message);
    }
  }
  return (
    <div className="">
      <Toaster position="top-right" />
      <div className="w-full flex justify-between px-10 sm:px-16 md:px-20 bg-green-600">
        <span>CREATE A POST</span>
        <Link
          className="text-lg cursor-pointer text-black hover:text-white hover:font-medium"
          href="/"
        >
          Blog
        </Link>
      </div>
      <div className="px-10 sm:px-16 md:px-20 py-[2vh]">
        <div className={`relative w-full ${!stateForm.image.value ? "h-32" : ""} overflow-hidden`}>
          {stateForm.image.value && typeof stateForm.image.value !== "string" &&(
            <CardMedia
              component="img"
              height="140"
              image={URL.createObjectURL(stateForm.image.value)}
              alt="post image"
            />
          )}
          <label
            htmlFor="imageUpload"
            className="absolute inset-0 flex items-center justify-center cursor-pointer rounded-xl"
          >
            {!stateForm.image.value && (
              <img src="/add.svg" className="w-full h-full" />
            )}
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="hidden"
              onChange={setImage}
            />
          </label>
        </div>
        <input
          name="title"
          placeholder="Post about feature"
          className={`bg-transparent ${
            stateForm.title.error ? "border-red-500" : "border-green-600"
          } w-full py-1.5 md:py-2.5 lg:py-4 outline-none`}
          onChange={setTitle}
          value={stateForm.title.value}
        />
        <Editor
          apiKey="6x76muyvgpg86w1ptdiuiebzb11jlffwj632yam39qzsbtvc"
          onInit={(_evt, editor) => (editorRef.current = editor)}
          initialValue={stateForm.description.value}
          onChange={setDescription}
          init={{
            height: 500,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
        />
      </div>
      <button
        className="mt-7 text-white bg-green-800 rounded-xl p-4 md:p-6 lg:p-8 w-max mx-auto flex hover:font-medium"
        onClick={createPost}
      >
        Send
      </button>
    </div>
  );
}
