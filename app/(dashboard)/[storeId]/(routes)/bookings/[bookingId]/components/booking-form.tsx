// @use-client
"use client"

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Booking } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";

// Define form schema for booking
const formSchema = z.object({
  status: z.string().min(1),
  // Add other fields from the Booking model if needed
});

type BookingFormValues = z.infer<typeof formSchema>;

interface BookingFormProps {
  initialData: Booking | null;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit booking' : 'Create booking';
  const description = initialData ? 'Edit a booking.' : 'Add a new booking';
  const toastMessage = initialData ? 'Booking updated.' : 'Booking created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      status: ''
      // Add other default values if needed
    }
  });

  const onSubmit = async (data: BookingFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        // Update booking logic
      } else {
        // Create booking logic
      }
      // Handle routing and notification after successful action
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      // Delete booking logic
      // Handle routing and notification after successful deletion
      toast.success('Booking deleted.');
    } catch (error: any) {
      toast.error('Error deleting booking.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
    <AlertModal 
      isOpen={open} 
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
     <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Booking status" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          {/* Add other form fields for booking data if needed */}
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
