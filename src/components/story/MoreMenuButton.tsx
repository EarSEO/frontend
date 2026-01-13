import Popover from "react-native-popover-view";

import { Pencil, Trash2Icon } from "lucide-react-native";
import styled from "styled-components/native";

import { theme } from "@/styles/theme";

import { useAuthStore } from "@/store/useAuthStore";

interface MoreMenuProps {
  visible: boolean;
  onClose?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onComplaint?: () => void;
  authorId?: number;
  anchorRef: React.RefObject<any>;
}

const MoreMenuButton: React.FC<MoreMenuProps> = ({
  visible,
  anchorRef,
  onClose,
  onEdit,
  onDelete,
  onComplaint,
  authorId,
}) => {
  const { user } = useAuthStore();
  const isMyPost = user?.memberId === authorId;

  if (!visible) return null;
  return (
    <Popover
      isVisible={visible}
      from={anchorRef}
      onRequestClose={onClose}
      popoverStyle={{
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        width: 180,
        gap: 12,
      }}
    >
      <MenuContainer>
        {isMyPost ? (
          <>
            <MenuItem onPress={onEdit}>
              <Pencil size={20} color={theme.colors.grey.neutral600} />
              <MenuText>게시글 수정</MenuText>
            </MenuItem>
            <MenuItem onPress={onDelete}>
              <Trash2Icon size={18} color={theme.colors.grey.neutral600} />
              <MenuText>게시글 삭제</MenuText>
            </MenuItem>
          </>
        ) : (
          <MenuItem onPress={onComplaint}>
            <Trash2Icon size={18} color={theme.colors.grey.neutral600} />
            <MenuText>게시글 신고</MenuText>
          </MenuItem>
        )}
      </MenuContainer>
    </Popover>
  );
};

const BackDrop = styled.Pressable`
  flex: 1;
  background-color: transparent;
`;

const MenuContainer = styled.Pressable`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg}px;
  border-color: ${theme.colors.grey.neutral500};

  width: 200px;
`;

const MenuItem = styled.Pressable`
  flex-direction: row;
  align-items: center;
  padding: 18px;
  gap: 12px;
`;

const MenuText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.text.textSecondary};
`;

export default MoreMenuButton;
