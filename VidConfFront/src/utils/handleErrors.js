import { toast } from "@/components/ui/use-toast";

export function handleErrors(error, error_variable, process) {
  if (error.response?.data?.message) {
    toast({
      title: "Uh oh! Something went wrong.",
      description: error.response.data.message,
      variant: "destructive",
    });
  } else {
    toast({
      title: "Uh oh! Something went wrong.",
      description: "Please try again later.",
      variant: "destructive",
    });
  }
  error_variable.value =
    error.response?.data?.error_code || `an error occurred while ${process}`;
}
