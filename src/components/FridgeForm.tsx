import Markdown from "react-markdown";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { Form } from "./ui/form";
import Dropzone from "./ui/dropzone";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { KeepScreenAwake } from "./KeepScreenAwake";
import {
  INGREDIENT_ERRORS,
  uploadSchema,
} from "~/server/api/validations/ingredient";

export const FrigdeForm = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const mutate = api.ingredient.submitAttachment.useMutation({
    onError: (res) => {
      switch (res.message) {
        case INGREDIENT_ERRORS.INCORRECT_IMAGE_TYPE:
          toast.error(INGREDIENT_ERRORS.INCORRECT_IMAGE_TYPE);
          break;
        case INGREDIENT_ERRORS.NULL_RESPONSE_FROM_OPENAI:
          toast.error(INGREDIENT_ERRORS.NULL_RESPONSE_FROM_OPENAI);
          break;
        default:
          toast.error("Something went wrong, please try again.");
          break;
      }
      setResponse(null);
      setPreview(null);
      return null;
    },
    onSuccess(res) {
      if (!res) {
        toast.error("Something went wrong, please try again.");
        setResponse(null);
        setPreview(null);
        return null;
      }
      setResponse(res);
    },
  });

  const form = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
  });

  async function onSubmit(values: z.infer<typeof uploadSchema>) {
    setResponse(null);
    await mutate.mutateAsync(values);
  }

  return (
    <div className="h-screen p-4 md:p-12">
      <div className="pb-6">
        <p>
          Upload an image of your fridge or pantry for a categorization and
          count of your ingredients.
        </p>
      </div>
      <div className="grid h-full gap-5 pb-12 md:grid-cols-2">
        <Form {...form}>
          <form className="" onSubmit={form.handleSubmit(onSubmit)}>
            <Dropzone
              containerClassName="min-h-96 h-full"
              style={preview ? { backgroundImage: `url(${preview})` } : {}}
              dropZoneClassName={cn(
                "h-full w-full",
                preview && `bg-cover bg-center bg-[image:var(--image-url)]`,
              )}
              showFilesList={true}
              onDrop={(acceptedFiles: File[]) => {
                if (acceptedFiles[0]) {
                  const file = acceptedFiles[0];
                  const reader = new FileReader();
                  reader.onloadend = async function () {
                    setPreview(reader.result as string);
                    await onSubmit({ base64Image: reader.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </form>
        </Form>
        <div
          className={cn(
            "relative rounded-lg p-4 text-neutral-900",
            response ? "bg-neutral-100" : "bg-neutral-50",
          )}
        >
          <div className="float-end flex justify-end md:block">
            <div className="rounded-md border-2 px-2 py-1">
              <KeepScreenAwake />
            </div>
          </div>
          {!!mutate.isPending && (
            <div className="flex w-96 flex-col gap-6">
              {loadingState()}
              {loadingState()}
              {loadingState()}
              {loadingState()}
            </div>
          )}
          {!!response && <Markdown className="prose">{response}</Markdown>}
        </div>
      </div>
    </div>
  );
};

const loadingState = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-4 w-10/12 animate-pulse rounded-md bg-gray-300" />
      <div className="h-4 w-8/12 animate-pulse rounded-md bg-gray-300" />
      <div className="h-4 w-11/12 animate-pulse rounded-md bg-gray-300" />
      <div className="h-4 w-7/12 animate-pulse rounded-md bg-gray-300" />
      <div className="h-4 w-10/12 animate-pulse rounded-md bg-gray-300" />
      <div className="h-4 w-8/12 animate-pulse rounded-md bg-gray-300" />
    </div>
  );
};
