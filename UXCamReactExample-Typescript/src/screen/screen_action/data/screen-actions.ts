export type ButtonActionType = {
  title?: string;
  isImage?: boolean;
  isOcclusion: boolean;
  isUserInteractionEnabled: boolean;
  accessibilityIdentifier?: boolean;
};

export const buttonActions: ButtonActionType[] = [
  {
    title: 'TitleButton',
    isOcclusion: true,
    isUserInteractionEnabled: true,
    accessibilityIdentifier: true,
  },
  {
    title: 'TitleButton',
    isOcclusion: true,
    isUserInteractionEnabled: true,
  },
  {
    title: 'TitleButton',
    isOcclusion: false,
    isUserInteractionEnabled: true,
    accessibilityIdentifier: true,
  },
  {
    title: 'TitleButton',
    isOcclusion: false,
    isUserInteractionEnabled: true,
  },
  {
    title: 'TitleButton',
    isOcclusion: true,
    isUserInteractionEnabled: false,
    accessibilityIdentifier: true,
  },
  {
    title: 'TitleButton',
    isOcclusion: true,
    isUserInteractionEnabled: false,
  },
  {
    title: 'TitleButton',
    isOcclusion: false,
    isUserInteractionEnabled: false,
    accessibilityIdentifier: true,
  },
  {
    title: 'TitleButton',
    isOcclusion: false,
    isUserInteractionEnabled: false,
  },
  {
    title: 'T&ImgButton',
    isImage: true,
    isOcclusion: true,
    isUserInteractionEnabled: true,
    accessibilityIdentifier: true,
  },
  {
    title: 'T&ImgButton',
    isImage: true,
    isOcclusion: true,
    isUserInteractionEnabled: true,
  },
  {
    title: 'T&ImgButton',
    isImage: true,
    isOcclusion: false,
    isUserInteractionEnabled: true,
    accessibilityIdentifier: true,
  },
  {
    title: 'T&ImgButton',
    isImage: true,
    isOcclusion: false,
    isUserInteractionEnabled: true,
  },
  {
    title: 'T&ImgButton',
    isImage: true,
    isOcclusion: true,
    isUserInteractionEnabled: false,
    accessibilityIdentifier: true,
  },
  {
    title: 'T&ImgButton',
    isImage: true,
    isOcclusion: true,
    isUserInteractionEnabled: false,
  },
  {
    title: 'T&ImgButton',
    isImage: true,
    isOcclusion: false,
    isUserInteractionEnabled: false,
    accessibilityIdentifier: true,
  },
  {
    title: 'T&ImgButton',
    isImage: true,
    isOcclusion: false,
    isUserInteractionEnabled: false,
  },
  {
    isImage: true,
    isOcclusion: true,
    isUserInteractionEnabled: true,
    accessibilityIdentifier: true,
  },
  {
    isImage: true,
    isOcclusion: true,
    isUserInteractionEnabled: true,
  },
  {
    isImage: true,
    isOcclusion: false,
    isUserInteractionEnabled: true,
    accessibilityIdentifier: true,
  },
  {
    isImage: true,
    isOcclusion: false,
    isUserInteractionEnabled: true,
  },
  {
    isImage: true,
    isOcclusion: true,
    isUserInteractionEnabled: false,
    accessibilityIdentifier: true,
  },
  {
    isImage: true,
    isOcclusion: true,
    isUserInteractionEnabled: false,
  },
  {
    isImage: true,
    isOcclusion: false,
    isUserInteractionEnabled: false,
    accessibilityIdentifier: true,
  },
  {
    isImage: true,
    isOcclusion: false,
    isUserInteractionEnabled: false,
  },
];
