import { CardMedia } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import Link from "next/link";
import { ChangeEvent, useReducer, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Editor as TinyMCEEditor } from "tinymce";
import { postReducer, FormStateType } from "@/reducers/postReducer";
import { Post } from "@/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";


export const getServerSideProps: GetServerSideProps<{ initialState: FormStateType, postId: string  }> = (async (
  context
) => {
  const { query } = context;
  const res = await fetch(
    process.env.NEXT_PUBLIC_SERVER_URI + "/post/" + query.id
  );
  const post: Post = await res.json();
  const initialState =  {
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
  if (res.status == 200) {
    const initialState = {
      title: {
        value: post.title,
        error: null,
      },
      description: {
        value: post.description,
        error: null,
      },
      image: {
        value: process.env.NEXT_PUBLIC_SERVER_URI + '/' + post.image,
        error: null,
      },
    };
    return { props: { initialState, postId: query.id as string  } }
  } 
  return { props: { initialState, postId: query.id as string } };
}) satisfies GetServerSideProps<{ initialState: FormStateType , postId: string }>;

export default function CreatePost({
  initialState, postId
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const [stateForm, dispatch] = useReducer(postReducer, initialState);
  const editorRef = useRef<TinyMCEEditor | null>(null);
  console.log(stateForm)
  function setTitle(e: ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: "set_name",
      value: e.target.value,
    });
    dispatch({
      type: "validate_title",
      value: "",
    });
  }
  function setDescription() {
    editorRef.current &&
      dispatch({
        type: "set_description",
        value: editorRef.current.getContent(),
      });
      dispatch({
        type: "validate_description",
        value: "",
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
    dispatch({
      type: "validate_image",
      value: "",
    });
  }
  async function createPost() {
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
    if(typeof stateForm.image.value === 'string'){
      const response = await fetch(stateForm.image.value); 
      const blob = await response.blob();
      const file = new File([blob], "image.png", { type: blob.type });
      formData.append('image', file);
    }else {
      formData.append("image", stateForm.image.value);
    }
    formData.append("title", stateForm.title.value);
    formData.append("description", stateForm.description.value);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SERVER_URI + "/post/" + postId,
        {
          method: "PATCH",
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
        toast.error(errors)
        errors.forEach((error: string) => toast.error(error));
       
      }
      await response.json();
      toast.success("Post updated");
    } catch (e: any) {
      console.error(e.message);
    }
  }
  return (
    <div className="">
      <Toaster position="top-right" />
      <div className="w-full flex justify-between px-10 sm:px-16 md:px-20 bg-green-600">
        <Link
          className="text-lg cursor-pointer text-black hover:text-white hover:font-medium"
          href={`/post/${postId}`}
        >
          View post
        </Link>
        <Link
          className="text-lg cursor-pointer text-black hover:text-white hover:font-medium"
          href="/"
        >
          Blog
        </Link>
      </div>
      <div className="px-10 sm:px-16 md:px-20 py-[2vh]">
        <div className={`relative w-full ${!stateForm.image.value ? "h-32" : ""} overflow-hidden`}>
          {stateForm.image.value && (
            typeof stateForm.image.value === "string" ? (
              <CardMedia
                component="img"
                height="140"
                image={stateForm.image.value}
                alt="post image"
              />
            ) :  (
              <CardMedia
                component="img"
                height="140"
                image={URL.createObjectURL(stateForm.image.value)}
                alt="post image"
              />
            )
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
