import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { JoinLobbySchema, type JoinLobbyInput } from "./schema";
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
import { toast } from "sonner";
import { ApiResponse } from "@/lib/types/api";
import { useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";

type JoinLobbyResponse = {
  lobby_id: string;
};

export function JoinLobbyForm(): JSX.Element {
  const navigate = useNavigate({ from: "/" });
  const form = useForm<JoinLobbyInput>({
    resolver: zodResolver(JoinLobbySchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(value: JoinLobbyInput) {
    let toastId = toast.loading("Logging in...");

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/lobbies/join`,
      {
        method: "POST",
        body: JSON.stringify(value),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    const result: ApiResponse<JoinLobbyResponse> = await response.json();

    if (!response.ok) {
      toast.error(result.message || "Server error.", { id: toastId });
      return;
    }

    toast.success(result.message, { id: toastId });
    await navigate({ to: `/lobbies/${result.data.lobby_id}` });
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Join Lobby</CardTitle>
        <CardDescription>Enter lobby code to join.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
