import { CategoryItem } from "@/components/tabEditScreen/cardCategoryItem";
import {
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React from "react";

// 1. DANH SÁCH CẤU HÌNH GỐC
export const CATEGORIES: CategoryItem[] = [
  {
    id: "1",
    name: "Ăn uống",
    icon: "silverware-fork-knife",
    library: "MaterialCommunityIcons",
    color: "#ff9800",
  },
  {
    id: "2",
    name: "Chi tiêu hàng",
    icon: "bottle-tonic-outline",
    library: "MaterialCommunityIcons",
    color: "#4caf50",
  },
  {
    id: "3",
    name: "Quần áo",
    icon: "tshirt-v-outline",
    library: "MaterialCommunityIcons",
    color: "#3f51b5",
  },
  {
    id: "4",
    name: "Mỹ phẩm",
    icon: "lipstick",
    library: "MaterialCommunityIcons",
    color: "#e91e63",
  },
  {
    id: "5",
    name: "Phí giao lưu",
    icon: "glass-cheers",
    library: "FontAwesome5",
    color: "#ffc107",
  },
  {
    id: "6",
    name: "Y tế",
    icon: "pill",
    library: "MaterialCommunityIcons",
    color: "#009688",
  },
  {
    id: "7",
    name: "Giáo dục",
    icon: "notebook-edit-outline",
    library: "MaterialCommunityIcons",
    color: "#f44336",
  },
  {
    id: "8",
    name: "Tiền điện",
    icon: "water-outline",
    library: "MaterialCommunityIcons",
    color: "#03a9f4",
  }, // Trong ảnh text là điện nhưng icon là nước
  {
    id: "9",
    name: "Đi lại",
    icon: "train",
    library: "MaterialCommunityIcons",
    color: "#795548",
  },
  {
    id: "10",
    name: "Phí liên lạc",
    icon: "cellphone",
    library: "MaterialCommunityIcons",
    color: "#607d8b",
  },
  {
    id: "11",
    name: "Tiền nhà",
    icon: "home-outline",
    library: "MaterialCommunityIcons",
    color: "#e91e63",
  },
  {
    id: "12",
    name: "Chỉnh Sửa",
    icon: "pencil-outline",
    library: "MaterialCommunityIcons",
    color: "#9e9e9e",
    isEditButton: true,
  },
  {
    id: "13",
    name: "Tiền lương",
    icon: "wallet-outline",
    library: "Ionicons",
    color: "#20b2aa",
  },
  {
    id: "14",
    name: "Tiền phụ cấp",
    icon: "piggy-bank-outline",
    library: "MaterialCommunityIcons",
    color: "#ff9800",
  },
  {
    id: "15",
    name: "Tiền thưởng",
    icon: "gift-outline",
    library: "Ionicons",
    color: "#f44336",
  },
  {
    id: "16",
    name: "Thu nhập phụ",
    icon: "sack-outline",
    library: "MaterialCommunityIcons",
    color: "#03a9f4",
  },
  {
    id: "17",
    name: "Đầu tư",
    icon: "coins",
    library: "FontAwesome5",
    color: "#009688",
  },
  {
    id: "18",
    name: "Thu nhập tạm",
    icon: "hand-holding-usd",
    library: "FontAwesome5",
    color: "#e91e63",
  },
  // Nút edit luôn ở cuối
];
// 2. TẠO MAP ĐỂ TRA CỨU NHANH
// Map này sẽ chứa thông tin cần thiết để render icon cho mỗi category
const CATEGORY_MAP = new Map<
  string,
  { icon: any; library: string; color: string }
>();

CATEGORIES.forEach((category) => {
  // Bỏ qua các nút đặc biệt như "Chỉnh Sửa"
  if (!category.isEditButton) {
    CATEGORY_MAP.set(category.name, {
      icon: category.icon,
      library: category.library || "MaterialCommunityIcons",
      color: category.color,
    });
  }
});

// Thêm một mục mặc định cho "Khác"
CATEGORY_MAP.set("Khác", {
  icon: "question-circle",
  library: "FontAwesome",
  color: "#888",
});

// 3. TẠO COMPONENT ĐỂ RENDER ICON
interface CategoryIconProps {
  category: string;
  size?: number;
}

export const CategoryIcon = ({ category, size = 28 }: CategoryIconProps) => {
  // Lấy thông tin icon từ Map, nếu không có thì dùng 'Khác'
  const iconInfo = CATEGORY_MAP.get(category) || CATEGORY_MAP.get("Khác");

  if (!iconInfo) return null; // Trường hợp dự phòng an toàn

  const props = {
    name: iconInfo.icon,
    size: size,
    color: iconInfo.color,
  };

  switch (iconInfo.library) {
    case "MaterialCommunityIcons":
      return <MaterialCommunityIcons {...props} />;
    case "FontAwesome5":
      return <FontAwesome5 {...props} />;
    case "FontAwesome":
      return <FontAwesome {...props} />;
    case "Ionicons":
      return <Ionicons {...props} />;
    default:
      return <FontAwesome name="question-circle" size={size} color="#888" />;
  }
};
