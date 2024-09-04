import { validateDescription, validateTitle } from "@/validators";

export type FormStateType = {
    title: {
      value: string;
      error: string | null;
    };
    description: {
      value: string;
      error: string | null;
    };
    image: {
      value: File | null | string;
      error: string | null;
    };
  };

export function postReducer(
    state: FormStateType,
    action: { type: string; value: any }
  ): FormStateType {
    switch (action.type) {
      case "set_name": {
        return {
          ...state,
          title: {
            ...state.title,
            value: action.value,
          },
        };
      }
      case "set_description": {
        return {
          ...state,
          description: {
            ...state.description,
            value: action.value,
          },
        };
      }
      case "set_image": {
        return {
          ...state,
          image: {
            ...state.image,
            value: action.value,
          },
        };
      }
      case "validate_title": {
        return {
          ...state,
          title: {
            ...state.title,
            error: validateTitle(state.title.value),
          },
        };
      }
      case "validate_description": {
        return {
          ...state,
          description: {
            ...state.description,
            error: validateDescription(state.description.value),
          },
        };
      }
      case "validate_image": {
        return {
          ...state,
          image: {
            ...state.image,
            error: state.image.value === null ? "Image must be upload" : "",
          },
        };
      }
    }
    throw Error("Unknown action: " + action.type);
  }