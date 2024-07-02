import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { PrismaClient } from '@prisma/client';


import { BookingColumn } from "./components/columns"
import { BookingClient } from "./components/client";


const prisma = new PrismaClient();

const BookingsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const bookings = await prismadb.booking.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedBookings: BookingColumn[] = bookings.map((item: { id: any; status: any; createdAt: number | Date; }) => ({
    id: item.id,
    status: item.status,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BookingClient data={formattedBookings} />
      </div>
    </div>
  );
};

export default BookingsPage;
