import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import z from "zod";

export function CreateJobForm() {
  const form = useForm<z.infer<typeof jobSeekerSchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {},
  });
  return <Form {...form}></Form>;
}
