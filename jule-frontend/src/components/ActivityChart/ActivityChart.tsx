import React from "react";
import styles from "./ActivityChart.module.css";
import ActivityCalendar, {CalendarData, Level} from "react-activity-calendar";

type ActivityChartProps = {
    exerciseData: { date: Date, count: number }[]
}

const ActivityChart = (props: ActivityChartProps) => {

    const levelFromCount = (count: number): Level => {
        if ([0, 1, 2, 3, 4].includes(count)) {
            return count as 0 | 1 | 2 | 3 | 4
        } else {
            return 4
        }
    }

    const setLevel = (rawDates: { date: Date, count: number }[]): CalendarData => rawDates.map(rawElem => {
        return {
            level: levelFromCount(rawElem.count),
            count: rawElem.count,
            date: new Date(rawElem.date).toISOString().split('T')[0]
        }
    })

    return (
        <div className={styles.parentDiv}>
            <ActivityCalendar
                data={setLevel(props.exerciseData)}
                labels={{
                    legend: {
                        less: 'Less',
                        more: 'More'
                    },
                    months: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec'
                    ],
                    totalCount: '{{count}} exercises completed in the last 180 days',
                    weekdays: [
                        'Sun',
                        'Mon',
                        'Tue',
                        'Wed',
                        'Thu',
                        'Fri',
                        'Sat'
                    ]
                }}
                weekStart={1}
                blockMargin={8}
                blockSize={15}
                showWeekdayLabels={true}
            />
        </div>
    )
}

export default ActivityChart
