import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema } from "@/app/utlis/zodSchemas";
import { Form } from "@/components/ui/form";

export function CompanyForm() {
  const form = useForm({
    // @ts-expect-error - zod version mismatch with @hookform/resolvers
    resolver: zodResolver(companySchema),
    defaultValues: {
      about: "",
      location: "",
      logo: "",
      name: "",
      website: "",
      xAccount: "",
    },
  });
  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-col-2 gap-6 "></div>
      </form>
    </Form>
  );
}
