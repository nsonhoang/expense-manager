import { fetchTransactions } from "@/features/transaction/transactionSlice";
import { setUser } from "@/features/user/userSlice";
import { store, useAppDispatch } from "@/store/store";
import {
  FirebaseAuthTypes,
  signOut as firebaseSignOut,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "@react-native-firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "@react-native-firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React, {
  createContext,
  useContext,
  useEffect,
  type PropsWithChildren,
} from "react";
import { useDispatch } from "react-redux";

// Định nghĩa các hàm và biến mà Context cung cấp
type AuthContextType = {
  // user: FirebaseAuthTypes.User | null;
  // isLoading: boolean;
  signInWithGoogle: () => Promise<void>; // Hàm đăng nhập Google mới
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  // user: null,
  // isLoading: true,
  signInWithGoogle: async () => {},
  signOut: () => null,
});

export function useSession() {
  const dispatch = useAppDispatch();
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const dispatch = useDispatch();

  const auth = getAuth();

  // 1. Cấu hình Google Sign-in ngay khi App khởi động
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "374246831148-tn23h9e1r27gs95m4mlmc2u9e4cou9ad.apps.googleusercontent.com", // Web Client ID của bạn
    });
  }, []);

  // 2. Lắng nghe trạng thái đăng nhập từ Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      dispatch(setUser(currentUser));
      // setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const saveUserToFirestore = async (user: FirebaseAuthTypes.User) => {
    if (!user?.uid) return;
    const db = getFirestore();

    const userRef = doc(db, "User", user.uid);
    try {
      const userSnapshot = await getDoc(userRef);
      if (!userSnapshot.exists()) {
        // === TRƯỜNG HỢP: USER MỚI (Chưa có) ===
        // Dùng setDoc để tạo mới
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          // Dùng serverTimestamp() (Hàm, không phải FieldValue...)
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });
        console.log("Đã tạo User mới!");
      } else {
        await updateDoc(userRef, {
          lastLogin: serverTimestamp(),
          // Cập nhật thêm thông tin nếu muốn đồng bộ
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
        console.log("Đã cập nhật User cũ!");
      }
    } catch (error) {
      console.log("lỗi " + error);
    }
  };
  // 3. Hàm Đăng nhập Google (Logic chuyển từ LoginScreen vào đây)
  const signInWithGoogle = async () => {
    try {
      // Reset trạng thái cũ để tránh lỗi "Sign-in in progress"
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // Bỏ qua lỗi nếu chưa đăng nhập
      }

      // Kiểm tra Play Services
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Mở Popup đăng nhập
      const signInResult = await GoogleSignin.signIn();

      // Lấy Token (Hỗ trợ cả version cũ và mới)
      let idToken = signInResult.data?.idToken;
      // if (!idToken) {
      //   idToken = signInResult.idToken;
      // }

      if (!idToken) {
        throw new Error("No ID token found");
      }

      // Tạo Credential và Đăng nhập Firebase
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      // Không cần làm gì thêm, onAuthStateChanged ở trên sẽ tự bắt được user mới

      store.dispatch(fetchTransactions(userCredential.user.uid));

      await saveUserToFirestore(userCredential.user);
    } catch (error) {
      console.error("Lỗi đăng nhập Google trong Context:", error);
      throw error; // Ném lỗi ra để màn hình Login hiển thị Alert
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut(); // Đăng xuất Google
      await firebaseSignOut(auth); // Đăng xuất Firebase
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        // user,
        // isLoading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
