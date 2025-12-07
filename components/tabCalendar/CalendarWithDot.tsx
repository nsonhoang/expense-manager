import { Transaction } from "@/app/(app)/(tabs)/calendar";
import { Color } from "@/constants/GlobalValue";
import { Calendar, LocaleConfig } from "react-native-calendars";
interface CalendarWithDotProps {
  listData: Transaction[];
  selectDate: string;
  updateSelectDate: (selectDate: string) => void;
  month: number;
  year: number;
  updateMonth: (month: number, year: number) => void;
}

export default function CalendarWithDot({
  listData,
  selectDate,
  updateSelectDate,
  month,
  updateMonth,
  year,
}: CalendarWithDotProps) {
  const listDate = listData.reduce((acc, d): any => {
    // Convert Date → "YYYY-MM-DD"
    const key = d.date.toISOString().split("T")[0];
    if (!acc[key]) {
      acc[key] = { dots: [] };
    }
    const color = d.isExpense ? Color.PRIMARY_COLOR : "red";

    if (!acc[key].dots.some((dot: any) => dot.color === color)) {
      acc[key].dots.push({ color });
    }
    return acc;
  }, {});

  const finalMarkedDates = { ...listDate }; // Copy danh sách dot

  // Nếu ngày được chọn đã có trong danh sách dot -> Merge thêm selected: true
  if (finalMarkedDates[selectDate]) {
    finalMarkedDates[selectDate] = {
      ...finalMarkedDates[selectDate], // Giữ lại dots cũ
      selected: true,
      selectedColor: "#e0f7fa", // Màu nền khi chọn
    };
  } else {
    // Nếu ngày được chọn chưa có dot -> Tạo mới
    finalMarkedDates[selectDate] = {
      selected: true,
      selectedColor: "#e0f7fa",
    };
  }

  LocaleConfig.locales["vi"] = {
    monthNames: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    monthNamesShort: [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ],
    dayNames: [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ],
    dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    today: "Hôm nay",
  };

  // Đặt ngôn ngữ mặc định
  LocaleConfig.defaultLocale = "vi";

  return (
    <Calendar
      markingType="multi-dot"
      style={{}}
      theme={{
        backgroundColor: "#ffffff",
        calendarBackground: "#ffffff",
        textSectionTitleColor: "#b6c1cd",
        selectedDayBackgroundColor: Color.PRIMARY_COLOR,
        selectedDayTextColor: "#ffffff",
        todayTextColor: "#da8b7e",
        dayTextColor: "#2d4150",
        arrowColor: Color.PRIMARY_COLOR,
      }}
      onDayPress={(day) => {
        updateSelectDate(day.dateString);
      }}
      onMonthChange={(month) => {
        // month = { year, month, day, timestamp, dateString }

        updateMonth(month.month, month.year);
        // ví dụ: gọi hàm bên ngoài để lọc dữ liệu theo tháng
        // updateSelectMonth(month.month, month.year);
      }}
      markedDates={finalMarkedDates}
    />
  );
}
