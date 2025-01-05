import Markdown from "react-markdown";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { Form } from "./ui/form";
import Dropzone from "./ui/dropzone";
import { useState } from "react";

export const uploadSchema = z.object({
  base64Image: z.string(),
});

export const FrigdeForm = () => {
  const [response, setResponse] = useState<string | null>(null);

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
    <div className="h-screen p-12">
      <div className="pb-6">
        <p>Upload an image to see what ingredients you have available.</p>
      </div>
      <div className="grid h-full grid-cols-2 gap-6">
        <Form {...form}>
          <form className="" onSubmit={form.handleSubmit(onSubmit)}>
            <Dropzone
              containerClassName="h-full"
              dropZoneClassName="h-full w-full"
              onDrop={(acceptedFiles: File[]) => {
                if (acceptedFiles[0]) {
                  const file = acceptedFiles[0];
                  const reader = new FileReader();
                  reader.onloadend = async function () {
                    await onSubmit({ base64Image: reader.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </form>
        </Form>
        <div>
          {mutate.isPending && <p>Processing...</p>}
          {!!response && <Markdown className="prose">{response}</Markdown>}
        </div>
      </div>
    </div>
  );
};
