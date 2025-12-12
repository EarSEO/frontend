import Popover from "react-native-popover-view";

import { useRouter } from "expo-router";
import { Pencil, Trash2Icon } from "lucide-react-native";
import styled from "styled-components/native";

import { theme } from "@/styles/theme";

interface MoreMenuProps {
  visible: boolean;
  onClose?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  anchorRef: React.RefObject<any>;
}

const MoreMenuButton: React.FC<MoreMenuProps> = ({
  visible,
  anchorRef,
  onClose,
  onEdit,
  onDelete,
}) => {
  const router = useRouter();

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
        <MenuItem onPress={onEdit}>
          <Pencil size={20} color={theme.colors.grey.neutral600} />
          <MenuText>게시글 수정</MenuText>
        </MenuItem>
        <MenuItem onPress={onDelete}>
          <Trash2Icon size={18} color={theme.colors.grey.neutral600} />
          <MenuText>게시글 삭제</MenuText>
        </MenuItem>
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
  font-size: ${theme.typography.fontSize.md};
  color: ${theme.colors.text.textSecondary};
`;

export default MoreMenuButton;
