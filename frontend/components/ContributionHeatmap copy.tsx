"use client";

import { useEffect, useState } from "react";

type Day = {
  date: string;
  contributionCount: number;
};

type Week = {
  contributionDays: Day[];
};

export default function ContributionHeatmap({
  username,
}: {
  username: string;
}) {
  const [weeks, setWeeks] = useState<Week[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/github-contributions?username=${username}`);
      const json = await res.json();
      setWeeks(
        json.data.user.contributionsCollection.contributionCalendar.weeks
      );
    };
    fetchData();
  }, [username]);

  // color scale based on contribution count
  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-200";
    if (count < 3) return "bg-green-200";
    if (count < 6) return "bg-green-400";
    if (count < 10) return "bg-green-600";
    return "bg-green-800";
  };

  // Extract month labels
  // const monthLabels: { index: number; label: string }[] = [];
  // weeks.forEach((week, wi) => {
  //   const firstDay = new Date(week.contributionDays[0].date);
  //   const month = firstDay.toLocaleString("default", { month: "short" });
  //   if (
  //     monthLabels.length === 0 ||
  //     monthLabels[monthLabels.length - 1].label !== month
  //   ) {
  //     monthLabels.push({ index: wi, label: month });
  //   }
  // });
  // Extract month labels more cleanly
  // Build a map of weekIndex -> monthLabel
  // Correct month label placement: label only when it's the 1st of a month
  const monthLabels: Record<number, string> = {};

  weeks.forEach((week, wi) => {
    week.contributionDays.forEach((day) => {
      const date = new Date(day.date);
      if (date.getDate() === 1) {
        console.log("date", date);
        const month = date.toLocaleString("default", { month: "short" });
        monthLabels[wi] = month;
      }
    });
  });

  const weekDays = ["Mon", "Wed", "Fri"];

  return (
    <div className="space-y-2">
      {/* Month labels */}
      <div className="flex text-xs text-gray-500 ml-10">
        {weeks.map((_, wi) => (
          <div key={wi} className="w-3 h-3 flex-shrink-0">
            {monthLabels[wi] ?? ""}
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
          {weeks.map((week, wi) => (
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
    </div>
  );
}
