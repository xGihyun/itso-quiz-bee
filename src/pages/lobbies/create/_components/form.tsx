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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { LobbyResponse } from "../types";

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
    let toastId = toast.loading("Creating lobby...");

    console.log(value)

    const response = await fetch(`http://localhost:3001/api/lobbies`, {
      method: "POST",
      body: JSON.stringify(value),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result: ApiResponse<LobbyResponse> = await response.json();

    if (!response.ok) {
      toast.error(result.message, { id: toastId });
      return;
    }

    console.log("New Lobby:", result);

    toast.success(result.message, { id: toastId });
    //navigate(`lobbies/${result.lobby_id}`)
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Create a New Lobby</CardTitle>
        <CardDescription>Enter the necessary details.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Create</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
