import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { JoinLobbySchema, type JoinLobbyInput } from "../schema";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { navigate } from "astro:transitions/client";
import type { ApiResponse } from "@/lib/types/api";
import { BACKEND_URL } from "astro:env/client";

export function JoinLobbyForm(): JSX.Element {
  const form = useForm<JoinLobbyInput>({
    resolver: zodResolver(JoinLobbySchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(value: JoinLobbyInput) {
    let toastId = toast.loading("Creating lobby...");

    console.log(value);

    const response = await fetch(`${BACKEND_URL}/api/lobbies/join`, {
      method: "POST",
      body: JSON.stringify(value),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result: ApiResponse = await response.json();

    if (!response.ok) {
      toast.error(result.message, { id: toastId });
      return;
    }

    console.log("Join Lobby:", result);

    toast.success(result.message, { id: toastId });
    //navigate(`lobbies/${result.lobby_id}`)
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Join a Lobby</CardTitle>
        <CardDescription>Enter the lobby code.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Join</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
