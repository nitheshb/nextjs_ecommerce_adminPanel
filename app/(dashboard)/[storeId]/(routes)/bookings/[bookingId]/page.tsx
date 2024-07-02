import prismadb from "@/lib/prismadb";
import { BookingForm } from "./components/booking-form";



const BookingPage = async ({
  params
}: {
  params: { bookingId: string }
}) => {
  const booking = await prismadb.booking.findUnique({
    where: {
      id: params.bookingId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BookingForm initialData={booking} />
      </div>
    </div>
  );
}

export default BookingPage;
