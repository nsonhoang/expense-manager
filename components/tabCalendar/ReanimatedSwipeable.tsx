import { Color } from "@/constants/GlobalValue";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface RightActionProps {
  drag: SharedValue<number>;
  handlerDelete: () => void;
  handlerEdit: () => void;
}

function RightAction({ drag, handlerDelete, handlerEdit }: RightActionProps) {
  const animationStyle = useAnimatedStyle(() => {
    const trans = interpolate(
      drag.value,
      [0, -160], // Input: Từ đóng đến mở
      [160, 0]
    );
    return {
      transform: [{ translateX: trans }],
    };
  });
  return (
    <Animated.View style={[styles.actionsContainer, animationStyle]}>
      <TouchableOpacity
        style={[styles.button, styles.edit]}
        onPress={handlerEdit}
      >
        <Text style={styles.actionText}>Sửa</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.delete]}
        onPress={handlerDelete}
      >
        <Text style={styles.actionText}>Xóa</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  actionsContainer: {
    width: 160, // SỬA LỖI: 80px * 2 nút = 160px
    flexDirection: "row",
  },
  button: {
    width: 80,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  edit: {
    backgroundColor: Color.PRIMARY_COLOR,
  },
  delete: {
    backgroundColor: "#d9534f",
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default RightAction;
