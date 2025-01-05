import Markdown from "react-markdown";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { Form } from "./ui/form";
import Dropzone from "./ui/dropzone";
import { useState } from "react";
import { cn } from "~/lib/utils";

export const uploadSchema = z.object({
  base64Image: z.string(),
});

export const FrigdeForm = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const mutate = api.ingredient.submitAttachment.useMutation({
    onSuccess(res) {
      if (!res) {
        toast.error("Something went wrong, please try again.");
        return null;
      }
      setResponse(res);
    },
  });

  const form = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
  });

  async function onSubmit(values: z.infer<typeof uploadSchema>) {
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
      <div className="grid h-full gap-6 pb-12 md:grid-cols-2">
        <Form {...form}>
          <form className="" onSubmit={form.handleSubmit(onSubmit)}>
            <Dropzone
              containerClassName="min-h-1/2 h-full"
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
                    setPreview(reader.result as string); // Set the Data URL as the preview
                    await onSubmit({ base64Image: reader.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </form>
        </Form>
        <div>
          {mutate.isPending && (
            <div className="flex w-96 flex-col gap-6">
              {loading()}
              {loading()}
              {loading()}
              {loading()}
            </div>
          )}
          {!!response && <Markdown className="prose">{response}</Markdown>}
        </div>
      </div>
    </div>
  );
};

const loading = () => {
  const skeletons = [10, 8, 11, 7, 0, 10, 8];

  return (
    <div className="flex flex-col gap-3">
      {skeletons.map((width, index) => (
        <div
          key={index}
          className={`h-4 w-${width}/12 animate-pulse rounded-md bg-gray-300`}
        />
      ))}
    </div>
  );
};
