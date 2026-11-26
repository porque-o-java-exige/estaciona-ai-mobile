import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';

import { useEnrichedBookings } from '@/features/bookings/hooks/use-bookings';
import {
  useCreateGarage,
  useDeleteGarage,
  useOwnerGarages,
  useUpdateGarage,
} from '@/features/garages/hooks/use-garages';
import { garageService } from '@/features/garages/services/garage.service';
import { GarageResponse } from '@/features/garages/types/garage.types';
import {
  useDeleteUserAccount,
  useDriverRating,
  useUpdateUserPhoto,
  useUpdateUserProfile,
  useUserProfile,
} from '@/features/users/hooks/use-users';
import {
  useCreateVehicle,
  useDeleteVehicle,
  useMyVehicles,
  useUpdateVehicle,
} from '@/features/vehicles/hooks/use-vehicles';
import { VehicleResponse } from '@/features/vehicles/types/vehicle.types';
import { useAuthStore } from '@/stores/use-auth-store';

import backArrowIconImg from '@assets/images/back-arrow-icon.png';
import carBookingIconImg from '@assets/images/car-booking-icon.png';
import chatIconImg from '@assets/images/chat-icon.png';
import editProfileIconImg from '@assets/images/edit-profile-icon.png';
import historyIconImg from '@assets/images/history-icon.png';
import notificationsIconImg from '@assets/images/notifications-icon.png';
import pinIconImg from '@assets/images/pin-icon.png';
import ratingStarIconImg from '@assets/images/rating-star-icon.png';
import verifiedProfileIconImg from '@assets/images/verified-profile-icon.png';
import * as S from './profile.styles';

type ProfileTab = 'GERAL' | 'VEICULOS' | 'GARAGENS' | 'CONFIG';

function parseOptionalPrice(raw: string): number | null {
  const normalized = raw.replace(',', '.').trim();
  if (!normalized) return null;
  const parsed = Number(normalized);
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const authUser = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  const userId = authUser?.id;

  const { data: userProfile } = useUserProfile(userId);
  const { data: ratingSummary } = useDriverRating(userId);
  const { data: vehicles = [] } = useMyVehicles();
  const { data: ownerGarages = [] } = useOwnerGarages();
  const { data: bookings = [] } = useEnrichedBookings();

  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfile();
  const { mutateAsync: updatePhoto, isPending: isUploadingPhoto } =
    useUpdateUserPhoto();
  const { mutateAsync: deleteAccount } = useDeleteUserAccount();

  const { mutateAsync: createVehicle, isPending: isCreatingVehicle } =
    useCreateVehicle();
  const { mutateAsync: updateVehicle, isPending: isUpdatingVehicle } =
    useUpdateVehicle();
  const { mutateAsync: deleteVehicle } = useDeleteVehicle();

  const { mutateAsync: createGarage, isPending: isCreatingGarage } =
    useCreateGarage();
  const { mutateAsync: updateGarage, isPending: isUpdatingGarage } =
    useUpdateGarage();
  const { mutateAsync: deleteGarage } = useDeleteGarage();

  const [activeTab, setActiveTab] = useState<ProfileTab>('GERAL');

  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [portugueseEnabled, setPortugueseEnabled] = useState(true);

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleResponse | null>(
    null
  );
  const [plateInput, setPlateInput] = useState('');
  const [brandInput, setBrandInput] = useState('');
  const [modelInput, setModelInput] = useState('');
  const [yearInput, setYearInput] = useState('2023');
  const [colorInput, setColorInput] = useState('');

  const [garageModalOpen, setGarageModalOpen] = useState(false);
  const [editingGarage, setEditingGarage] = useState<GarageResponse | null>(
    null
  );
  const [garageName, setGarageName] = useState('');
  const [garageAddress, setGarageAddress] = useState('');
  const [garageDesc, setGarageDesc] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [garageFeatures, setGarageFeatures] = useState<string[]>([]);
  const [garagePriceHour, setGaragePriceHour] = useState('');
  const [garagePriceDay, setGaragePriceDay] = useState('');
  const [garageLat, setGarageLat] = useState('-23.561414');
  const [garageLng, setGarageLng] = useState('-46.655881');
  const [garageCoverUri, setGarageCoverUri] = useState<string | null>(null);
  const [isUploadingGarageImg, setIsUploadingGarageImg] = useState(false);

  const displayName = userProfile?.name || authUser?.name || 'Usuário';
  const displayEmail = userProfile?.email || authUser?.email || '';
  const displayPhone = userProfile?.phoneNumber || '';
  const avatarUri = userProfile?.photoUrl || null;

  const activeBooking = bookings.find(
    (b) => b.status === 'ACTIVE' || b.status === 'IN_PROGRESS'
  );

  const appVersion = Constants.expoConfig?.version || '1.0.0';

  function signOutUser() {
    if (typeof clearSession === 'function') {
      clearSession();
    } else {
      useAuthStore.setState({ user: null, token: null });
    }
    router.replace('/(auth)/login');
  }

  function openEditProfileModal() {
    setNameInput(displayName);
    setEmailInput(displayEmail);
    setPhoneInput(displayPhone);
    setPasswordInput('');
    setEditProfileOpen(true);
  }

  async function handlePickUserPhoto() {
    if (!userId) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permissão necessária',
        'Permita acesso à galeria para trocar sua foto de perfil.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]) return;

    try {
      const asset = result.assets[0];
      await updatePhoto({
        userId,
        fileUri: asset.uri,
        mimeType: asset.mimeType || 'image/jpeg',
      });
      Alert.alert('Sucesso', 'Foto de perfil atualizada!');
    } catch {
      Alert.alert('Erro', 'Não foi possível enviar a foto de perfil.');
    }
  }

  async function handleSaveProfile() {
    if (!userId) return;
    if (!nameInput.trim() || !emailInput.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha nome e e-mail.');
      return;
    }

    try {
      await updateProfile({
        userId,
        payload: {
          name: nameInput.trim(),
          email: emailInput.trim(),
          phoneNumber: phoneInput.trim() || '11999998888',
          ...(passwordInput.trim().length >= 6
            ? { password: passwordInput.trim() }
            : {}),
        },
      });
      setEditProfileOpen(false);
      Alert.alert('Perfil atualizado', 'Seus dados foram salvos com sucesso.');
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar seu perfil.');
    }
  }

  function handleConfirmDeleteAccount() {
    if (!userId) return;
    Alert.alert(
      'Excluir conta',
      'Tem certeza que deseja excluir permanentemente sua conta e seus dados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount(userId);
              signOutUser();
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir a conta agora.');
            }
          },
        },
      ]
    );
  }

  function openCreateVehicle() {
    setEditingVehicle(null);
    setPlateInput('');
    setBrandInput('');
    setModelInput('');
    setYearInput('2023');
    setColorInput('');
    setVehicleModalOpen(true);
  }

  function openEditVehicle(vehicle: VehicleResponse) {
    setEditingVehicle(vehicle);
    setPlateInput(vehicle.licensePlate);
    setBrandInput(vehicle.brand);
    setModelInput(vehicle.model);
    setYearInput(String(vehicle.year));
    setColorInput(vehicle.color);
    setVehicleModalOpen(true);
  }

  async function handleSaveVehicle() {
    if (!plateInput.trim() || !brandInput.trim() || !modelInput.trim()) {
      Alert.alert('Atenção', 'Preencha placa, marca e modelo do veículo.');
      return;
    }

    const payload = {
      licensePlate: plateInput.trim().toUpperCase(),
      year: Number(yearInput) || 2023,
      brand: brandInput.trim().toUpperCase(),
      model: modelInput.trim().toUpperCase(),
      color: colorInput.trim().toUpperCase() || 'PRATA',
    };

    try {
      if (editingVehicle) {
        await updateVehicle({ vehicleId: editingVehicle.id, payload });
      } else {
        await createVehicle(payload);
      }
      setVehicleModalOpen(false);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar os dados do veículo.');
    }
  }

  function handleConfirmDeleteVehicle(vehicleId: string) {
    Alert.alert('Remover veículo', 'Deseja excluir este veículo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          void deleteVehicle(vehicleId);
        },
      },
    ]);
  }

  function handleAddFeature() {
    const trimmed = featureInput.trim();
    if (!trimmed) return;
    if (
      garageFeatures.some((f) => f.toLowerCase() === trimmed.toLowerCase())
    ) {
      setFeatureInput('');
      return;
    }
    setGarageFeatures((prev) => [...prev, trimmed]);
    setFeatureInput('');
  }

  function handleRemoveFeature(indexToRemove: number) {
    setGarageFeatures((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }

  function openCreateGarage() {
    setEditingGarage(null);
    setGarageName('');
    setGarageAddress('');
    setGarageDesc('');
    setFeatureInput('');
    setGarageFeatures([]);
    setGaragePriceHour('');
    setGaragePriceDay('');
    setGarageLat('-23.561414');
    setGarageLng('-46.655881');
    setGarageCoverUri(null);
    setGarageModalOpen(true);
  }

  function openEditGarage(garage: GarageResponse) {
    setEditingGarage(garage);
    setGarageName(garage.name);
    setGarageAddress(garage.address);
    setGarageDesc(garage.description ?? '');
    setFeatureInput('');
    setGarageFeatures(Array.isArray(garage.features) ? garage.features : []);
    setGaragePriceHour(
      garage.pricePerHour && garage.pricePerHour > 0
        ? String(garage.pricePerHour)
        : ''
    );
    setGaragePriceDay(
      garage.pricePerDay && garage.pricePerDay > 0
        ? String(garage.pricePerDay)
        : ''
    );
    setGarageLat(String(garage.latitude));
    setGarageLng(String(garage.longitude));
    setGarageCoverUri(garage.coverImageUrl || null);
    setGarageModalOpen(true);
  }

  async function handlePickGarageImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permissão necessária',
        'Permita acesso à galeria para adicionar uma foto da garagem.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]) return;

    try {
      setIsUploadingGarageImg(true);
      const asset = result.assets[0];
      const uploadedUrl = await garageService.uploadGarageImage(
        asset.uri,
        asset.mimeType || 'image/jpeg'
      );
      setGarageCoverUri(uploadedUrl);
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : 'Não foi possível enviar a imagem agora.';
      Alert.alert('Erro no upload', msg);
    } finally {
      setIsUploadingGarageImg(false);
    }
  }

  async function handleSaveGarage() {
    if (!garageName.trim() || !garageAddress.trim()) {
      Alert.alert('Atenção', 'Preencha nome e endereço da garagem.');
      return;
    }

    const parsedHour = parseOptionalPrice(garagePriceHour);
    const parsedDay = parseOptionalPrice(garagePriceDay);

    if (parsedHour === null && parsedDay === null) {
      Alert.alert(
        'Preço obrigatório',
        'Informe pelo menos um valor válido (por hora ou por dia).'
      );
      return;
    }

    const pendingFeature = featureInput.trim();
    const finalFeatures =
      pendingFeature &&
      !garageFeatures.some(
        (f) => f.toLowerCase() === pendingFeature.toLowerCase()
      )
        ? [...garageFeatures, pendingFeature]
        : garageFeatures;

    const payload = {
      name: garageName.trim(),
      address: garageAddress.trim(),
      latitude: Number(garageLat) || -23.561414,
      longitude: Number(garageLng) || -46.655881,
      description: garageDesc.trim(),
      features: finalFeatures,
      available: editingGarage?.available ?? true,
      pricePerHour: parsedHour,
      pricePerDay: parsedDay,
      coverImageUrl: garageCoverUri || null,
      images: garageCoverUri ? [garageCoverUri] : [],
    };

    try {
      if (editingGarage) {
        await updateGarage({ garageId: editingGarage.garageId, payload });
      } else {
        await createGarage(payload);
      }
      setGarageModalOpen(false);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a garagem.');
    }
  }

  function handleConfirmDeleteGarage(garageId: string) {
    Alert.alert('Excluir garagem', 'Deseja remover esta garagem?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          void deleteGarage(garageId);
        },
      },
    ]);
  }

  function handleLogout() {
    Alert.alert('Sair da conta', 'Deseja realmente sair do EstacionaAí?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: signOutUser,
      },
    ]);
  }

  return (
    <S.Container $topInset={insets.top}>
      <S.HeaderRow>
        <S.BackButton
          onPress={() => router.replace('/(main)/(tabs)')}
          activeOpacity={0.75}
        >
          <S.BackArrowIcon source={backArrowIconImg} resizeMode="contain" />
        </S.BackButton>
        <S.HeaderTitle>Perfil</S.HeaderTitle>
      </S.HeaderRow>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 16) + 110,
        }}
      >
        <S.ProfileTopCard>
          <S.AvatarWrapper
            onPress={() => {
              void handlePickUserPhoto();
            }}
            activeOpacity={0.8}
          >
            {avatarUri ? (
              <S.AvatarImage source={{ uri: avatarUri }} resizeMode="cover" />
            ) : (
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 14,
                  backgroundColor: '#E1EDFA',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: theme.fonts.bold,
                    fontSize: 22,
                    color: theme.colors.blue[1000],
                  }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <S.VerifiedBadgeIcon
              source={verifiedProfileIconImg}
              resizeMode="contain"
            />
          </S.AvatarWrapper>

          <S.UserInfoColumn>
            <S.UserName>{displayName}</S.UserName>
            <S.UserEmail>{displayEmail}</S.UserEmail>
            <S.RatingRow>
              <S.StarIcon source={ratingStarIconImg} resizeMode="contain" />
              <S.RatingText>
                {(ratingSummary?.averageRating || 4.9).toFixed(1)}
              </S.RatingText>
              <S.BookingsCountText>
                {bookings.length} reservas
              </S.BookingsCountText>
            </S.RatingRow>
          </S.UserInfoColumn>

          <S.EditProfileBtn
            onPress={openEditProfileModal}
            activeOpacity={0.8}
          >
            <S.EditProfileText>Editar</S.EditProfileText>
            <S.EditProfileIcon
              source={editProfileIconImg}
              resizeMode="contain"
            />
          </S.EditProfileBtn>
        </S.ProfileTopCard>

        <S.StatsRow>
          <S.StatBox>
            <S.StatValue>{vehicles.length}</S.StatValue>
            <S.StatLabel>Veículos</S.StatLabel>
          </S.StatBox>

          <S.StatBox>
            <S.StatValue>{ownerGarages.length}</S.StatValue>
            <S.StatLabel>Garagens</S.StatLabel>
          </S.StatBox>

          <S.StatBox>
            <S.StatValue>{bookings.length}</S.StatValue>
            <S.StatLabel>Reservas</S.StatLabel>
          </S.StatBox>
        </S.StatsRow>

        <S.TabsRow>
          {(
            [
              { key: 'GERAL', label: 'Geral' },
              { key: 'VEICULOS', label: 'Veículos' },
              { key: 'GARAGENS', label: 'Garagens' },
              { key: 'CONFIG', label: 'Config' },
            ] as const
          ).map((tab) => (
            <S.TabPill
              key={tab.key}
              $active={activeTab === tab.key}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.85}
            >
              <S.TabPillText $active={activeTab === tab.key}>
                {tab.label}
              </S.TabPillText>
            </S.TabPill>
          ))}
        </S.TabsRow>

        {activeTab === 'GERAL' ? (
          <S.SectionList>
            <S.ActiveBookingCard>
              <S.ActiveBookingTitle>Reserva ativa</S.ActiveBookingTitle>
              <S.ActiveBookingBody>
                <S.SoftIconBox>
                  <S.OptionIcon source={pinIconImg} resizeMode="contain" />
                </S.SoftIconBox>
                <S.ActiveBookingInfo>
                  <S.ItemTitle>
                    {activeBooking?.garage?.name ||
                      'Nenhuma reserva ativa no momento'}
                  </S.ItemTitle>
                  <S.ItemSubtitle>
                    {activeBooking
                      ? `Total R$ ${activeBooking.totalAmount.toFixed(2).replace('.', ',')}`
                      : 'Explore vagas no mapa para reservar'}
                  </S.ItemSubtitle>
                </S.ActiveBookingInfo>
              </S.ActiveBookingBody>
              <S.ActiveBookingFooter>
                <S.ActiveBookingHint>
                  Máximo de 1 vaga reservada por vez
                </S.ActiveBookingHint>
              </S.ActiveBookingFooter>
            </S.ActiveBookingCard>

            <S.MenuOptionCard
              activeOpacity={0.8}
              onPress={() => router.push('/(main)/(tabs)/chat')}
            >
              <S.MenuOptionLeft>
                <S.SoftIconBox>
                  <S.OptionIcon source={chatIconImg} resizeMode="contain" />
                </S.SoftIconBox>
                <S.MenuOptionTextCol>
                  <S.ItemTitle>Conversas</S.ItemTitle>
                  <S.MenuOptionBlueSub>Online</S.MenuOptionBlueSub>
                </S.MenuOptionTextCol>
              </S.MenuOptionLeft>
              <S.ChevronText>›</S.ChevronText>
            </S.MenuOptionCard>

            <S.MenuOptionCard
              activeOpacity={0.8}
              onPress={() => router.push('/(main)/notifications')}
            >
              <S.MenuOptionLeft>
                <S.SoftIconBox>
                  <S.OptionIcon
                    source={notificationsIconImg}
                    resizeMode="contain"
                  />
                </S.SoftIconBox>
                <S.MenuOptionTextCol>
                  <S.ItemTitle>Notificações</S.ItemTitle>
                  <S.MenuOptionBlueSub>Ativas</S.MenuOptionBlueSub>
                </S.MenuOptionTextCol>
              </S.MenuOptionLeft>
              <S.ChevronText>›</S.ChevronText>
            </S.MenuOptionCard>

            <S.MenuOptionCard
              activeOpacity={0.8}
              onPress={() => router.push('/(main)/(tabs)/bookings')}
            >
              <S.MenuOptionLeft>
                <S.SoftIconBox>
                  <S.OptionIcon source={historyIconImg} resizeMode="contain" />
                </S.SoftIconBox>
                <S.MenuOptionTextCol>
                  <S.ItemTitle>Histórico</S.ItemTitle>
                  <S.MenuOptionBlueSub>
                    Todas as suas reservas anteriores
                  </S.MenuOptionBlueSub>
                </S.MenuOptionTextCol>
              </S.MenuOptionLeft>
              <S.ChevronText>›</S.ChevronText>
            </S.MenuOptionCard>
          </S.SectionList>
        ) : null}

        {activeTab === 'VEICULOS' ? (
          <S.SectionList>
            {vehicles.map((vehicle, index) => (
              <S.VehicleCard key={vehicle.id} $primary={index === 0}>
                <S.VehicleTopRow>
                  <S.SoftIconBox>
                    <S.OptionIcon
                      source={carBookingIconImg}
                      resizeMode="contain"
                    />
                  </S.SoftIconBox>

                  <S.VehicleInfoCol>
                    <S.ItemTitle>
                      {vehicle.year} {vehicle.brand} {vehicle.model}
                    </S.ItemTitle>
                    <S.PlateBadge>
                      <S.PlateBadgeText>
                        {vehicle.licensePlate}
                      </S.PlateBadgeText>
                    </S.PlateBadge>
                  </S.VehicleInfoCol>

                  {index === 0 ? (
                    <S.PrimaryBadge>
                      <S.PrimaryBadgeText>principal</S.PrimaryBadgeText>
                    </S.PrimaryBadge>
                  ) : null}
                </S.VehicleTopRow>

                <S.SmallActionsRow>
                  <S.SmallActionBtn
                    onPress={() => openEditVehicle(vehicle)}
                    activeOpacity={0.8}
                  >
                    <S.SmallActionText>Editar</S.SmallActionText>
                  </S.SmallActionBtn>

                  <S.SmallActionBtn
                    $danger
                    onPress={() => handleConfirmDeleteVehicle(vehicle.id)}
                    activeOpacity={0.8}
                  >
                    <S.SmallActionText $danger>Excluir</S.SmallActionText>
                  </S.SmallActionBtn>
                </S.SmallActionsRow>
              </S.VehicleCard>
            ))}

            <S.DashedAddButton
              onPress={openCreateVehicle}
              activeOpacity={0.85}
            >
              <S.DashedAddButtonText>
                + Adicionar Veículos
              </S.DashedAddButtonText>
            </S.DashedAddButton>
          </S.SectionList>
        ) : null}

        {activeTab === 'GARAGENS' ? (
          <S.SectionList>
            {ownerGarages.map((garage) => {
              const hasHour =
                garage.pricePerHour !== null && garage.pricePerHour > 0;
              const hasDay =
                garage.pricePerDay !== null && garage.pricePerDay > 0;

              return (
                <S.GarageOwnerCard key={garage.garageId}>
                  <S.GarageImageBox>
                    {garage.coverImageUrl ? (
                      <S.GarageCoverImage
                        source={{ uri: garage.coverImageUrl }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#E1EDFA',
                        }}
                      >
                        <Image
                          source={pinIconImg}
                          style={{ width: 28, height: 28, opacity: 0.6 }}
                          resizeMode="contain"
                        />
                        <Text
                          style={{
                            fontFamily: theme.fonts.medium,
                            fontSize: 12,
                            color: theme.colors.blue[1000],
                            marginTop: 6,
                          }}
                        >
                          Sem foto cadastrada
                        </Text>
                      </View>
                    )}
                    <S.GarageStatusPill>
                      <S.GarageStatusPillText>
                        {garage.available ? 'Ativo' : 'Indisponível'}
                      </S.GarageStatusPillText>
                    </S.GarageStatusPill>
                  </S.GarageImageBox>

                  <S.GarageBody>
                    <S.GarageHeaderLine>
                      <View style={{ flex: 1 }}>
                        <S.ItemTitle>{garage.name}</S.ItemTitle>
                        <S.ItemSubtitle>{garage.address}</S.ItemSubtitle>
                      </View>
                      {hasHour ? (
                        <S.GaragePriceText>
                          R$
                          {garage.pricePerHour!.toFixed(2).replace('.', ',')}
                          /hr
                        </S.GaragePriceText>
                      ) : hasDay ? (
                        <S.GaragePriceText>
                          R$
                          {garage.pricePerDay!.toFixed(2).replace('.', ',')}
                          /dia
                        </S.GaragePriceText>
                      ) : null}
                    </S.GarageHeaderLine>

                    {garage.description ? (
                      <S.ItemSubtitle>{garage.description}</S.ItemSubtitle>
                    ) : null}

                    {Array.isArray(garage.features) &&
                    garage.features.length > 0 ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          gap: 6,
                        }}
                      >
                        {garage.features.map((feat) => (
                          <View
                            key={feat}
                            style={{
                              backgroundColor: '#EFF6FF',
                              borderWidth: 1,
                              borderColor: '#BFDBFE',
                              borderRadius: 999,
                              paddingHorizontal: 10,
                              paddingVertical: 4,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: theme.fonts.medium,
                                fontSize: 11,
                                color: theme.colors.blue[1000],
                              }}
                            >
                              {feat}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : null}

                    <S.GarageMetricsRow>
                      {hasDay ? (
                        <S.GarageMetricCol>
                          <S.GarageMetricLabel>Diária</S.GarageMetricLabel>
                          <S.GarageGreenValue>
                            R$
                            {garage.pricePerDay!.toFixed(2).replace('.', ',')}
                          </S.GarageGreenValue>
                        </S.GarageMetricCol>
                      ) : null}

                      <S.GarageMetricCol>
                        <S.GarageMetricLabel>Status</S.GarageMetricLabel>
                        <S.GarageDarkValue>
                          {garage.available ? 'Disponível' : 'Pausada'}
                        </S.GarageDarkValue>
                      </S.GarageMetricCol>
                    </S.GarageMetricsRow>

                    <S.SmallActionsRow>
                      <S.SmallActionBtn
                        onPress={() => openEditGarage(garage)}
                        activeOpacity={0.8}
                      >
                        <S.SmallActionText>Editar / Foto</S.SmallActionText>
                      </S.SmallActionBtn>

                      <S.SmallActionBtn
                        $danger
                        onPress={() =>
                          handleConfirmDeleteGarage(garage.garageId)
                        }
                        activeOpacity={0.8}
                      >
                        <S.SmallActionText $danger>Excluir</S.SmallActionText>
                      </S.SmallActionBtn>
                    </S.SmallActionsRow>
                  </S.GarageBody>
                </S.GarageOwnerCard>
              );
            })}

            <S.DashedAddButton
              onPress={openCreateGarage}
              activeOpacity={0.85}
            >
              <S.DashedAddButtonText>
                + Adicionar Garagens
              </S.DashedAddButtonText>
            </S.DashedAddButton>
          </S.SectionList>
        ) : null}

        {activeTab === 'CONFIG' ? (
          <S.SectionList>
            <S.ConfigRowCard>
              <View>
                <S.ItemTitle>Modo Escuro</S.ItemTitle>
                <S.ItemSubtitle>
                  {darkModeEnabled ? 'ativado' : 'desativado'}
                </S.ItemSubtitle>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: '#CBD5E1', true: '#1E5BB7' }}
              />
            </S.ConfigRowCard>

            <S.ConfigRowCard>
              <View>
                <S.ItemTitle>Notificações</S.ItemTitle>
                <S.ItemSubtitle>
                  {notificationsEnabled ? 'ativo' : 'silenciado'}
                </S.ItemSubtitle>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#CBD5E1', true: '#1E5BB7' }}
              />
            </S.ConfigRowCard>

            <S.ConfigRowCard>
              <View>
                <S.ItemTitle>Idioma</S.ItemTitle>
                <S.ItemSubtitle>
                  {portugueseEnabled ? 'Português' : 'English'}
                </S.ItemSubtitle>
              </View>
              <Switch
                value={portugueseEnabled}
                onValueChange={setPortugueseEnabled}
                trackColor={{ false: '#CBD5E1', true: '#1E5BB7' }}
              />
            </S.ConfigRowCard>

            <S.MenuOptionCard
              activeOpacity={0.8}
              onPress={handleConfirmDeleteAccount}
            >
              <S.MenuOptionTextCol>
                <Text
                  style={{
                    fontFamily: theme.fonts.bold,
                    fontSize: 14,
                    color: '#DC2626',
                    includeFontPadding: false,
                  }}
                >
                  Excluir minha conta
                </Text>
                <S.ItemSubtitle>
                  Remove permanentemente seu cadastro do sistema
                </S.ItemSubtitle>
              </S.MenuOptionTextCol>
              <Text
                style={{
                  fontFamily: theme.fonts.bold,
                  fontSize: 18,
                  color: '#DC2626',
                }}
              >
                ›
              </Text>
            </S.MenuOptionCard>
          </S.SectionList>
        ) : null}

        <S.LogoutSection>
          <S.LogoutButton onPress={handleLogout} activeOpacity={0.85}>
            <S.LogoutButtonText>Sair da conta</S.LogoutButtonText>
          </S.LogoutButton>
          <S.AppVersionText>
            EstacionaAí • Versão {appVersion}
          </S.AppVersionText>
        </S.LogoutSection>
      </ScrollView>

      {/* MODAL EDITAR PERFIL + PATCH FOTO */}
      <Modal
        visible={editProfileOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setEditProfileOpen(false)}
      >
        <S.ModalOverlay>
          <S.ModalSheet>
            <S.ModalHeader>
              <S.ModalTitle>Editar Perfil</S.ModalTitle>
              <TouchableOpacity onPress={() => setEditProfileOpen(false)}>
                <Text
                  style={{
                    fontFamily: theme.fonts.bold,
                    color: theme.colors.blue[1000],
                  }}
                >
                  Fechar
                </Text>
              </TouchableOpacity>
            </S.ModalHeader>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ alignItems: 'center', marginBottom: 14, gap: 8 }}>
                {avatarUri ? (
                  <Image
                    source={{ uri: avatarUri }}
                    style={{ width: 76, height: 76, borderRadius: 16 }}
                  />
                ) : (
                  <View
                    style={{
                      width: 76,
                      height: 76,
                      borderRadius: 16,
                      backgroundColor: '#E1EDFA',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: theme.fonts.bold,
                        fontSize: 28,
                        color: theme.colors.blue[1000],
                      }}
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <S.SmallActionBtn
                  onPress={() => {
                    void handlePickUserPhoto();
                  }}
                  disabled={isUploadingPhoto}
                >
                  <S.SmallActionText>
                    {isUploadingPhoto
                      ? 'Enviando foto...'
                      : 'Alterar foto de perfil'}
                  </S.SmallActionText>
                </S.SmallActionBtn>
              </View>

              <S.FieldGroup>
                <S.FieldLabel>Nome completo</S.FieldLabel>
                <S.FieldInput value={nameInput} onChangeText={setNameInput} />
              </S.FieldGroup>

              <S.FieldGroup>
                <S.FieldLabel>E-mail</S.FieldLabel>
                <S.FieldInput
                  value={emailInput}
                  onChangeText={setEmailInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </S.FieldGroup>

              <S.FieldGroup>
                <S.FieldLabel>Telefone</S.FieldLabel>
                <S.FieldInput
                  value={phoneInput}
                  onChangeText={setPhoneInput}
                  keyboardType="phone-pad"
                />
              </S.FieldGroup>

              <S.FieldGroup>
                <S.FieldLabel>Nova senha (opcional)</S.FieldLabel>
                <S.FieldInput
                  value={passwordInput}
                  onChangeText={setPasswordInput}
                  secureTextEntry
                  placeholder="Deixe vazio para manter a atual"
                  placeholderTextColor="#94A3B8"
                />
              </S.FieldGroup>

              <S.SavePrimaryBtn
                disabled={isUpdatingProfile}
                onPress={() => {
                  void handleSaveProfile();
                }}
              >
                {isUpdatingProfile ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <S.SavePrimaryBtnText>Salvar alterações</S.SavePrimaryBtnText>
                )}
              </S.SavePrimaryBtn>
            </ScrollView>
          </S.ModalSheet>
        </S.ModalOverlay>
      </Modal>

      {/* MODAL VEÍCULO */}
      <Modal
        visible={vehicleModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setVehicleModalOpen(false)}
      >
        <S.ModalOverlay>
          <S.ModalSheet>
            <S.ModalHeader>
              <S.ModalTitle>
                {editingVehicle ? 'Editar Veículo' : 'Adicionar Veículo'}
              </S.ModalTitle>
              <TouchableOpacity onPress={() => setVehicleModalOpen(false)}>
                <Text
                  style={{
                    fontFamily: theme.fonts.bold,
                    color: theme.colors.blue[1000],
                  }}
                >
                  Fechar
                </Text>
              </TouchableOpacity>
            </S.ModalHeader>

            <ScrollView showsVerticalScrollIndicator={false}>
              <S.FieldGroup>
                <S.FieldLabel>Placa (ex: ABC1D23)</S.FieldLabel>
                <S.FieldInput
                  value={plateInput}
                  onChangeText={setPlateInput}
                  autoCapitalize="characters"
                  maxLength={7}
                />
              </S.FieldGroup>

              <S.FieldGroup>
                <S.FieldLabel>Marca (ex: TOYOTA)</S.FieldLabel>
                <S.FieldInput
                  value={brandInput}
                  onChangeText={setBrandInput}
                />
              </S.FieldGroup>

              <S.FieldGroup>
                <S.FieldLabel>Modelo (ex: COROLLA)</S.FieldLabel>
                <S.FieldInput
                  value={modelInput}
                  onChangeText={setModelInput}
                />
              </S.FieldGroup>

              <S.FieldGroup>
                <S.FieldLabel>Ano</S.FieldLabel>
                <S.FieldInput
                  value={yearInput}
                  onChangeText={setYearInput}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </S.FieldGroup>

              <S.FieldGroup>
                <S.FieldLabel>Cor</S.FieldLabel>
                <S.FieldInput
                  value={colorInput}
                  onChangeText={setColorInput}
                />
              </S.FieldGroup>

              <S.SavePrimaryBtn
                disabled={isCreatingVehicle || isUpdatingVehicle}
                onPress={() => {
                  void handleSaveVehicle();
                }}
              >
                {isCreatingVehicle || isUpdatingVehicle ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <S.SavePrimaryBtnText>Salvar veículo</S.SavePrimaryBtnText>
                )}
              </S.SavePrimaryBtn>
            </ScrollView>
          </S.ModalSheet>
        </S.ModalOverlay>
      </Modal>

      {/* MODAL GARAGEM */}
      <Modal
        visible={garageModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setGarageModalOpen(false)}
      >
        <S.ModalOverlay>
          <S.ModalSheet>
            <S.ModalHeader>
              <S.ModalTitle>
                {editingGarage ? 'Editar Garagem' : 'Nova Garagem'}
              </S.ModalTitle>
              <TouchableOpacity onPress={() => setGarageModalOpen(false)}>
                <Text
                  style={{
                    fontFamily: theme.fonts.bold,
                    color: theme.colors.blue[1000],
                  }}
                >
                  Fechar
                </Text>
              </TouchableOpacity>
            </S.ModalHeader>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <S.FieldGroup>
                <S.FieldLabel>Foto da Garagem</S.FieldLabel>
                {garageCoverUri ? (
                  <Image
                    source={{ uri: garageCoverUri }}
                    style={{
                      width: '100%',
                      height: 120,
                      borderRadius: 12,
                      marginBottom: 8,
                    }}
                    resizeMode="cover"
                  />
                ) : null}
                <S.DashedAddButton
                  disabled={isUploadingGarageImg}
                  onPress={() => {
                    void handlePickGarageImage();
                  }}
                >
                  <S.DashedAddButtonText>
                    {isUploadingGarageImg
                      ? 'Enviando imagem...'
                      : garageCoverUri
                        ? 'Trocar imagem da garagem'
                        : '+ Adicionar imagem da garagem'}
                  </S.DashedAddButtonText>
                </S.DashedAddButton>
              </S.FieldGroup>

              <S.FieldGroup>
                <S.FieldLabel>Nome da garagem</S.FieldLabel>
                <S.FieldInput
                  value={garageName}
                  onChangeText={setGarageName}
                  placeholder="Ex: Garagem MASP Consolação"
                  placeholderTextColor="#94A3B8"
                />
              </S.FieldGroup>

              <S.FieldGroup>
                <S.FieldLabel>Endereço completo</S.FieldLabel>
                <S.FieldInput
                  value={garageAddress}
                  onChangeText={setGarageAddress}
                  placeholder="Ex: Av. Paulista, 1578 - São Paulo"
                  placeholderTextColor="#94A3B8"
                />
              </S.FieldGroup>

              <S.FieldGroup>
                <S.FieldLabel>Descrição (opcional)</S.FieldLabel>
                <S.FieldInput
                  value={garageDesc}
                  onChangeText={setGarageDesc}
                  placeholder="Descreva detalhes da vaga..."
                  placeholderTextColor="#94A3B8"
                />
              </S.FieldGroup>

              <S.FieldGroup>
                <S.FieldLabel>
                  Características (digite e aperte Enter)
                </S.FieldLabel>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <S.FieldInput
                    style={{ flex: 1 }}
                    value={featureInput}
                    onChangeText={setFeatureInput}
                    placeholder="Ex: Coberta, Portão eletrônico..."
                    placeholderTextColor="#94A3B8"
                    returnKeyType="done"
                    blurOnSubmit={false}
                    onSubmitEditing={handleAddFeature}
                  />
                  <TouchableOpacity
                    onPress={handleAddFeature}
                    activeOpacity={0.8}
                    style={{
                      backgroundColor: theme.colors.blue[1000],
                      height: 44,
                      paddingHorizontal: 14,
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: theme.fonts.bold,
                        fontSize: 16,
                        color: '#FFFFFF',
                      }}
                    >
                      +
                    </Text>
                  </TouchableOpacity>
                </View>

                {garageFeatures.length > 0 ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      gap: 8,
                      marginTop: 8,
                    }}
                  >
                    {garageFeatures.map((feat, idx) => (
                      <TouchableOpacity
                        key={`${feat}-${idx}`}
                        onPress={() => handleRemoveFeature(idx)}
                        activeOpacity={0.75}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                          backgroundColor: '#EFF6FF',
                          borderWidth: 1,
                          borderColor: '#BFDBFE',
                          borderRadius: 999,
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: theme.fonts.medium,
                            fontSize: 12,
                            color: theme.colors.blue[1000],
                          }}
                        >
                          {feat}
                        </Text>
                        <Text
                          style={{
                            fontFamily: theme.fonts.bold,
                            fontSize: 12,
                            color: '#DC2626',
                          }}
                        >
                          ×
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}
              </S.FieldGroup>

              <S.FieldGroup>
                <S.FieldLabel>Preço por Hora (R$) — deixe vazio ou 0 se não houver</S.FieldLabel>
                <S.FieldInput
                  value={garagePriceHour}
                  onChangeText={setGaragePriceHour}
                  keyboardType="numeric"
                  placeholder="Ex: 12"
                  placeholderTextColor="#94A3B8"
                />
              </S.FieldGroup>

              <S.FieldGroup>
                <S.FieldLabel>Preço por Dia (R$) — deixe vazio ou 0 se não houver</S.FieldLabel>
                <S.FieldInput
                  value={garagePriceDay}
                  onChangeText={setGaragePriceDay}
                  keyboardType="numeric"
                  placeholder="Ex: 80"
                  placeholderTextColor="#94A3B8"
                />
              </S.FieldGroup>

              <S.SavePrimaryBtn
                disabled={
                  isCreatingGarage || isUpdatingGarage || isUploadingGarageImg
                }
                onPress={() => {
                  void handleSaveGarage();
                }}
              >
                {isCreatingGarage || isUpdatingGarage ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <S.SavePrimaryBtnText>Salvar garagem</S.SavePrimaryBtnText>
                )}
              </S.SavePrimaryBtn>
            </ScrollView>
          </S.ModalSheet>
        </S.ModalOverlay>
      </Modal>
    </S.Container>
  );
}