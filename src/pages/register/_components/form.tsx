import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RegisterSchema, type RegisterInput } from "../schema";
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
import { toast } from "sonner";
import { navigate } from "astro:transitions/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BACKEND_URL } from "astro:env/client";
import type { ApiResponse } from "@/lib/types/api";

export function RegisterForm(): JSX.Element {
  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(value: RegisterInput) {
    let toastId = toast.loading("Registering...");

    const response = await fetch(`${BACKEND_URL}/api/register`, {
      method: "POST",
      body: JSON.stringify(value),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result: ApiResponse = await response.json();

    console.log("Result:", result);

    if (!response.ok) {
      toast.error(result.message || "Server error.", { id: toastId });
      return;
    }

    toast.success(result.message, { id: toastId });
    await navigate("/login");
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Enter your credentials to register.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
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
