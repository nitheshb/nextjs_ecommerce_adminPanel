"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { columns, BookingColumn } from "./columns";

interface BookingClientProps {
  data: BookingColumn[];
}

export const BookingClient: React.FC<BookingClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Bookings (${data.length})`} description="Manage bookings for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/bookings/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="status" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Bookings" />
      <Separator />
      <ApiList entityName="bookings" entityIdName="bookingId" />
    </>
  );
};
