"use client";

import { useEffect, useState } from "react";

type Day = { date: string; contributionCount: number };
type Week = { contributionDays: Day[] };

export default function ContributionHeatmap({
  username,
}: {
  username: string;
}) {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/github-contributions?username=${username}`
        );
        const json = await res.json();
        setWeeks(
          json.data.user.contributionsCollection.contributionCalendar.weeks
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-200";
    if (count < 3) return "bg-green-200";
    if (count < 6) return "bg-green-400";
    if (count < 10) return "bg-green-600";
    return "bg-green-800";
  };

  // Build month labels - Improved approach
  const getMonthLabels = () => {
    if (weeks.length === 0) return [];

    const labels: { index: number; month: string }[] = [];
    let lastMonth = "";

    // Find the first day of each month in the data
    weeks.forEach((week, weekIndex) => {
      week.contributionDays.forEach((day) => {
        const date = new Date(day.date);
        const month = date.toLocaleString("default", { month: "short" });
        const dayOfMonth = date.getDate();

        // Show label at the beginning of each month
        if (dayOfMonth <= 7 && month !== lastMonth) {
          labels.push({ index: weekIndex, month });
          lastMonth = month;
        }
      });
    });

    return labels;
  };

  const monthLabels = getMonthLabels();
  const weekDays = ["Mon", "Wed", "Fri"];

  return (
    <div className="space-y-5">
      {/* Month labels */}
      <div className="flex text-xs text-gray-500 ml-10 relative">
        {loading
          ? Array(12)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="w-12 h-3 flex-shrink-0"></div>
              ))
          : monthLabels.map((label, i) => (
              <div
                key={i}
                className="absolute"
                style={{ left: `${label.index * 16}px` }} // 16px is approx width of a week column
              >
                {label.month}
              </div>
            ))}
      </div>

      <div className="flex">
        {/* Weekday labels */}
        <div className="flex flex-col mr-2 text-xs text-gray-500 justify-between py-1">
          {weekDays.map((d) => (
            <span key={d} className="h-3">
              {d}
            </span>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex space-x-1 overflow-x-auto">
          {loading
            ? Array.from({ length: 53 }).map((_, wi) => (
                <div key={wi} className="flex flex-col space-y-1">
                  {Array.from({ length: 7 }).map((_, di) => (
                    <div
                      key={di}
                      className="w-3 h-3 bg-gray-300 animate-pulse"
                    />
                  ))}
                </div>
              ))
            : weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col space-y-1">
                  {week.contributionDays.map((day, di) => (
                    <div
                      key={di}
                      className={`w-3 h-3 ${getColor(day.contributionCount)}`}
                      title={`${day.date}: ${day.contributionCount} contributions`}
                    />
                  ))}
                </div>
              ))}
        </div>
      </div>

      {/* Legend */}
      {!loading && (
        <div className="flex items-center justify-end space-x-1 text-xs text-gray-500">
          <span>Less</span>
          {[0, 2, 5, 9, 15].map((c, i) => (
            <div key={i} className={`w-3 h-3 ${getColor(c)}`} />
          ))}
          <span>More</span>
        </div>
      )}
    </div>
  );
}
