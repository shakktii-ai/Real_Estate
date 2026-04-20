import { Star } from 'lucide-react';

export default function ReviewCard({ review }) {
  const getTimeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);

    const seconds = Math.floor((now - created) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);

      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  };
  return (
    <div className="bg-white text-black rounded-md border border-gray-300 shadow-lg hover:shadow-xl transition-all">
      <div className="flex justify-start gap-4 rounded-md  p-2 bg-[#F4F4F4]">
        <div className="w-12 h-12 rounded-full bg-[#D9D9D9] flex items-center justify-center  font-bold text-lg uppercase">
          {review.customerName?.charAt(0)}
        </div>
        <div>
          <h3 className="font-bold text-lg ">{review.customerName}</h3>
          <p className="text-xs ">Verified Customer</p>
        </div>
      </div>
      <hr className='h-1 text-gray-300 ' />

      <div className="flex justify-between gap-2   p-4">
        <div className='flex gap-1'>
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={20} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
        ))}
        </div>
          <p className="text-sm text-gray-500">
        {getTimeAgo(review.createdAt)}
      </p>
      </div>
    
      <p className="text-gray-600 text-sm leading-relaxed   p-4">{review.reviewText}</p>

      <a href={review.googleLink} target="_blank" className="text-[#1447EA] font-bold text-sm p-4 hover:underline ">
        View on Google →
      </a>
    </div>
  );
}