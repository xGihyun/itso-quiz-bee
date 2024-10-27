import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { NewLobbySchema, type NewLobbyInput } from "../schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { actions } from "astro:actions";
import { toast } from "sonner";
import { navigate } from "astro:transitions/client";

export function NewLobbyForm(): JSX.Element {
  const form = useForm<NewLobbyInput>({
    resolver: zodResolver(NewLobbySchema),
    defaultValues: {
      name: "",
      description: "",
      status: "closed",
    },
  });

  async function onSubmit(value: NewLobbyInput) {
    let toastId = toast.loading("Submitting...");

    console.log(value);

    const response = await fetch(`http://localhost:3001/lobbies`, {
      method: "POST",
      body: JSON.stringify(value),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      toast.error("", { id: toastId });
      return;
    }

    const result = await response.json();

    console.log("New Lobby:", result);

    toast.success("Successfully created lobby!", { id: toastId });
    //navigate(`lobbies/${result.lobby_id}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
