import { useRef } from "react";

import { useRouter } from "expo-router";
import styled from "styled-components/native";

import CustomBottomSheet from "@/components/bottomSheet/CustomBottomSheet";
import AddressLabel from "@/components/common/AddressLabel";
import BackButton from "@/components/common/BackButton";
import Button from "@/components/common/Button";
import CloseButton from "@/components/common/CloseButton";
import CourseCard from "@/components/common/CourseCard";
import Input from "@/components/common/Input";
import LocationLabel from "@/components/common/LocationLabel";
import SightCard from "@/components/common/SightCard";

import { theme } from "@/styles/theme";

export default function Index() {
  const Ref = useRef<any>(null);
  const router = useRouter();
  const handleButton = () => {
    router.navigate("../story");
  };
  const handleUser = () => {
    router.navigate("../myPage");
  };

  return (
    <Container>
      <MapContainer>
        <HeaderWrapper>
          <BackButton buttonStyle="CIRCLE" />
          <CloseButton buttonStyle="CIRCLE" onPress="../story" />
        </HeaderWrapper>

        <InputWrapper>
          <Input
            width="360px"
            backgroundColor={theme.colors.white}
            placeholderTextColor={theme.colors.text.textSecondary}
            placeholder="검색어를 입력하세요."
          />
        </InputWrapper>
      </MapContainer>
      <CustomBottomSheet bottomSheetRef={Ref}>
        <LabelWrapper>
          <LocationLabel locationInfo="BOOKMARK" locationTitle="어디로든 문" />
          <LocationLabel
            locationInfo="SIGHT"
            locationTitle="갱남으로 모여"
            address="서울시 용산구"
            distance={1200}
            locationtheme="음식"
          />
          <SightList>
            <SightCard
              image="data:image/jpeg;base64,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"
              sightName="펭귄놈자식이"
              sightTheme="잠깨라"
              iconStyle="DETAIL"
              onCardPress={handleButton}
              onIconPress={handleUser}
            >
              <AddressLabel distance={3200} address="서울시 용산구" />
            </SightCard>
            <CourseCard
              onPress={handleUser}
              courseTitle="추운 겨울을 펭귄과 느껴보세요."
              courseSubTitle="펭귄이랑 걷기 대회 1등하러 간다."
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiAuFOOS2hnFuZckd5Xf6PxhbBYLT6VJqTtg&s"
            ></CourseCard>
            <SightCard
              sightName="펭귄놈자식이"
              sightTheme="잠깨라"
              iconStyle="DETAIL"
            ></SightCard>
          </SightList>
        </LabelWrapper>

        <ButtonWrapper>
          <Button text="완료" onPress={handleButton} />
        </ButtonWrapper>
      </CustomBottomSheet>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
`;
const MapContainer = styled.View`
  flex: 1;
  align-items: center;
`;

const Header = styled.View`
  flex: 1;
  align-items: center;
`;
const HeaderWrapper = styled.View`
  width: 90%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const InputWrapper = styled.View`
  padding-top: 10;
`;

const ButtonWrapper = styled.View`
  flex: 1;
  justify-content: center;
`;

const SightList = styled.View``;

const LabelWrapper = styled.View`
  align-items: center;
  gap: 10;
`;
