import React from 'react';
import { Empty } from 'antd';
import { useTranslation } from '../../mls';
import './index.css';

interface NoDataProps {
  children?: React.ReactNode;
  description?: string;
}

const EmptySvgIcon = () => (
  <svg
    width="160"
    height="159"
    viewBox="0 0 160 159"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Empty raw svg icon</title>
    <g clipPath="url(#clip0_22874_4831)">
      <circle cx="80" cy="79.5" r="79.5" fill="url(#paint0_linear_22874_4831)" />
      <path
        d="M138.345 76.0554L130.404 46.4199L121.549 62.5768L123.456 67.4594L138.345 76.0554Z"
        fill="#FAFAFA"
      />
      <path
        d="M92.0226 39.2191C95.0761 33.9304 96.6028 31.286 99.2127 30.6021C101.823 29.9183 104.496 31.4619 109.844 34.5493L130.404 46.42L125.951 54.1331C122.898 59.4219 121.371 62.0663 122.084 64.6684C122.796 67.2705 125.47 68.8142 130.818 71.9016L138.616 76.4043L119.184 110.062C116.131 115.35 114.604 117.995 111.994 118.679C109.384 119.362 106.711 117.819 101.363 114.731L73.0038 98.3581C67.6563 95.2707 64.9825 93.727 64.2698 91.1249C63.5572 88.5227 65.0839 85.8784 68.1374 80.5896L92.0226 39.2191Z"
        fill="#FAFAFA"
      />
      <path
        d="M130.404 46.42L131.369 46.1558L131.26 45.7595L130.904 45.554L130.404 46.42ZM138.616 76.4043L139.482 76.9043L139.691 76.5427L139.581 76.1401L138.616 76.4043ZM101.863 113.865L73.5038 97.4921L72.5038 99.2241L100.863 115.597L101.863 113.865ZM69.0034 81.0896L92.8887 39.7191L91.1566 38.7191L67.2713 80.0896L69.0034 81.0896ZM109.344 35.4154L129.904 47.286L130.904 45.554L110.344 33.6833L109.344 35.4154ZM129.538 45.92L125.085 53.6331L126.817 54.6331L131.27 46.92L129.538 45.92ZM130.318 72.7676L138.116 77.2703L139.116 75.5382L131.318 71.0356L130.318 72.7676ZM137.75 75.9043L118.318 109.562L120.05 110.562L139.482 76.9043L137.75 75.9043ZM73.5038 97.4921C70.8058 95.9344 68.8695 94.8141 67.5085 93.7669C66.1696 92.7368 65.51 91.8672 65.2343 90.8607L63.3054 91.389C63.7424 92.9847 64.7759 94.188 66.289 95.3521C67.7799 96.4992 69.8542 97.6944 72.5038 99.2241L73.5038 97.4921ZM67.2713 80.0896C65.7589 82.7093 64.5718 84.761 63.8658 86.4859C63.1484 88.2389 62.8678 89.7913 63.3054 91.389L65.2343 90.8607C64.9592 89.8563 65.0857 88.7855 65.7168 87.2435C66.3593 85.6736 67.4624 83.7588 69.0034 81.0896L67.2713 80.0896ZM100.863 115.597C103.513 117.127 105.585 118.326 107.324 119.044C109.089 119.772 110.647 120.065 112.248 119.646L111.741 117.711C110.731 117.976 109.648 117.839 108.087 117.195C106.5 116.54 104.561 115.423 101.863 113.865L100.863 115.597ZM118.318 109.562C116.777 112.231 115.671 114.143 114.632 115.485C113.612 116.802 112.748 117.447 111.741 117.711L112.248 119.646C113.85 119.226 115.054 118.207 116.214 116.709C117.355 115.235 118.538 113.181 120.05 110.562L118.318 109.562ZM125.085 53.6331C123.573 56.2528 122.386 58.3045 121.68 60.0295C120.962 61.7824 120.682 63.3348 121.119 64.9325L123.048 64.4042C122.773 63.3999 122.9 62.329 123.531 60.787C124.173 59.2171 125.276 57.3023 126.817 54.6331L125.085 53.6331ZM131.318 71.0356C128.62 69.4779 126.683 68.3576 125.322 67.3105C123.983 66.2803 123.324 65.4107 123.048 64.4042L121.119 64.9325C121.556 66.5282 122.59 67.7315 124.103 68.8956C125.594 70.0427 127.668 71.2379 130.318 72.7676L131.318 71.0356ZM92.8887 39.7191C94.4297 37.05 95.5365 35.1373 96.5748 33.7959C97.5946 32.4783 98.4588 31.8334 99.4661 31.5695L98.9592 29.6348C97.3567 30.0547 96.1526 31.0739 94.9932 32.5717C93.8524 34.0456 92.6691 36.0995 91.1566 38.7191L92.8887 39.7191ZM110.344 33.6833C107.694 32.1536 105.622 30.9548 103.883 30.2371C102.118 29.5089 100.56 29.2154 98.9592 29.6348L99.4661 31.5695C100.476 31.305 101.559 31.4414 103.12 32.0859C104.707 32.741 106.646 33.8577 109.344 35.4154L110.344 33.6833ZM139.581 76.1401L131.369 46.1558L129.44 46.6842L137.652 76.6684L139.581 76.1401Z"
        fill="#E0E0E0"
      />
      <path
        d="M18.4617 68.7182C15.4084 63.4296 13.8817 60.7854 14.5944 58.1834C15.307 55.5813 17.9806 54.0377 23.3279 50.9504L43.8877 39.0803L48.3407 46.7931C51.394 52.0816 52.9207 54.7259 55.5304 55.4097C58.1401 56.0936 60.8138 54.55 66.1611 51.4627L73.9596 46.9602L93.3909 80.6162C96.4442 85.9047 97.9709 88.549 97.2582 91.151C96.5456 93.753 93.872 95.2966 88.5247 98.3839L60.1664 114.757C54.8191 117.844 52.1455 119.387 49.5357 118.704C46.926 118.02 45.3993 115.375 42.346 110.087L18.4617 68.7182Z"
        fill="#FAFAFA"
      />
      <path
        d="M43.8877 39.0803L44.1411 38.1129L43.7436 38.0088L43.3877 38.2142L43.8877 39.0803ZM73.9596 46.9602L74.8256 46.4602L74.6169 46.0987L74.2131 45.9929L73.9596 46.9602ZM88.0247 97.5179L59.6664 113.891L60.6664 115.623L89.0247 99.2499L88.0247 97.5179ZM43.212 109.587L19.3277 68.2182L17.5957 69.2182L41.48 110.587L43.212 109.587ZM23.8279 51.8165L44.3877 39.9463L43.3877 38.2142L22.8279 50.0844L23.8279 51.8165ZM43.0216 39.5803L47.4746 47.2931L49.2067 46.2931L44.7537 38.5803L43.0216 39.5803ZM66.6611 52.3287L74.4596 47.8262L73.4596 46.0942L65.6611 50.5967L66.6611 52.3287ZM73.0936 47.4602L92.5249 81.1162L94.2569 80.1162L74.8256 46.4602L73.0936 47.4602ZM59.6664 113.891C56.9685 115.448 55.0303 116.565 53.443 117.22C51.8815 117.864 50.7986 118.001 49.7892 117.736L49.2823 119.671C50.8826 120.09 52.4414 119.797 54.206 119.069C55.9448 118.351 58.017 117.152 60.6664 115.623L59.6664 113.891ZM41.48 110.587C42.9923 113.206 44.1756 115.26 45.3164 116.734C46.4757 118.232 47.6798 119.251 49.2823 119.671L49.7892 117.736C48.7819 117.472 47.9178 116.827 46.898 115.51C45.8597 114.169 44.753 112.256 43.212 109.587L41.48 110.587ZM89.0247 99.2499C91.6741 97.7203 93.7484 96.5251 95.2392 95.378C96.7522 94.214 97.7857 93.0108 98.2227 91.4151L96.2938 90.8868C96.0181 91.8932 95.3585 92.7628 94.0197 93.7929C92.6587 94.84 90.7225 95.9603 88.0247 97.5179L89.0247 99.2499ZM92.5249 81.1162C94.0658 83.7852 95.1688 85.7 95.8113 87.2698C96.4424 88.8117 96.5688 89.8825 96.2938 90.8868L98.2227 91.4151C98.6603 89.8174 98.3797 88.2651 97.6623 86.5122C96.9563 84.7873 95.7693 82.7357 94.2569 80.1162L92.5249 81.1162ZM47.4746 47.2931C48.987 49.9126 50.1703 51.9664 51.3111 53.4403C52.4704 54.938 53.6745 55.9572 55.2769 56.3771L55.7839 54.4424C54.7766 54.1784 53.9125 53.5336 52.8927 52.2161C51.8544 50.8747 50.7477 48.9621 49.2067 46.2931L47.4746 47.2931ZM65.6611 50.5967C62.9632 52.1543 61.025 53.2709 59.4377 53.926C57.8762 54.5704 56.7933 54.7069 55.7839 54.4424L55.2769 56.3771C56.8773 56.7964 58.4361 56.503 60.2006 55.7748C61.9394 55.0571 64.0117 53.8584 66.6611 52.3287L65.6611 50.5967ZM19.3277 68.2182C17.7868 65.5492 16.6838 63.6344 16.0413 62.0645C15.4102 60.5226 15.2838 59.4518 15.5588 58.4475L13.6299 57.9192C13.1923 59.5169 13.4729 61.0693 14.1903 62.8221C14.8963 64.547 16.0833 66.5987 17.5957 69.2182L19.3277 68.2182ZM22.8279 50.0844C20.1785 51.6141 18.1042 52.8093 16.6134 53.9563C15.1004 55.1204 14.0669 56.3236 13.6299 57.9192L15.5588 58.4475C15.8345 57.4411 16.4941 56.5715 17.8329 55.5414C19.1939 54.4943 21.1301 53.3741 23.8279 51.8165L22.8279 50.0844ZM74.2131 45.9929L44.1411 38.1129L43.6342 40.0476L73.7061 47.9276L74.2131 45.9929Z"
        fill="#E0E0E0"
      />
      <path d="M116 56.5L89.5 30L90 52.5L95 56.5H116Z" fill="white" />
      <path
        d="M44.5 45.8242C44.5 38.3646 44.5 34.6348 46.8431 32.3174C49.1863 30 52.9575 30 60.5 30H89.5V40.8791C89.5 48.3387 89.5 52.0685 91.8431 54.3859C94.1863 56.7033 97.9575 56.7033 105.5 56.7033H116.5V104.176C116.5 111.635 116.5 115.365 114.157 117.683C111.814 120 108.042 120 100.5 120H60.5C52.9575 120 49.1863 120 46.8431 117.683C44.5 115.365 44.5 111.635 44.5 104.176V45.8242Z"
        fill="white"
      />
      <path
        d="M89.5 30L90.2032 29.289L89.911 29H89.5V30ZM116.5 56.7033H117.5V56.2858L117.203 55.9923L116.5 56.7033ZM100.5 119H60.5V121H100.5V119ZM45.5 104.176V45.8242H43.5V104.176H45.5ZM60.5 31H89.5V29H60.5V31ZM88.5 30V40.8791H90.5V30H88.5ZM105.5 57.7033H116.5V55.7033H105.5V57.7033ZM115.5 56.7033V104.176H117.5V56.7033H115.5ZM60.5 119C56.7008 119 53.9509 118.998 51.8536 118.719C49.784 118.444 48.5007 117.915 47.5463 116.972L46.14 118.394C47.5287 119.767 49.3026 120.397 51.59 120.702C53.8498 121.002 56.7567 121 60.5 121V119ZM43.5 104.176C43.5 107.877 43.4978 110.755 43.802 112.992C44.1103 115.26 44.7497 117.019 46.14 118.394L47.5463 116.972C46.5935 116.029 46.0613 114.764 45.7838 112.723C45.5022 110.651 45.5 107.934 45.5 104.176H43.5ZM100.5 121C104.243 121 107.15 121.002 109.41 120.702C111.697 120.397 113.471 119.767 114.86 118.394L113.454 116.972C112.499 117.915 111.216 118.444 109.146 118.719C107.049 118.998 104.299 119 100.5 119V121ZM115.5 104.176C115.5 107.934 115.498 110.651 115.216 112.723C114.939 114.764 114.407 116.029 113.454 116.972L114.86 118.394C116.25 117.019 116.89 115.26 117.198 112.992C117.502 110.755 117.5 107.877 117.5 104.176H115.5ZM88.5 40.8791C88.5 44.5803 88.4978 47.458 88.802 49.6955C89.1103 51.963 89.7497 53.7219 91.14 55.0969L92.5463 53.6749C91.5935 52.7325 91.0613 51.4678 90.7838 49.4261C90.5022 47.3546 90.5 44.6375 90.5 40.8791H88.5ZM105.5 55.7033C101.701 55.7033 98.9509 55.7012 96.8536 55.4223C94.784 55.1472 93.5007 54.6188 92.5463 53.6749L91.14 55.0969C92.5287 56.4704 94.3026 57.1007 96.59 57.4049C98.8498 57.7054 101.757 57.7033 105.5 57.7033V55.7033ZM45.5 45.8242C45.5 42.0658 45.5022 39.3487 45.7838 37.2772C46.0613 35.2355 46.5935 33.9708 47.5463 33.0284L46.14 31.6064C44.7497 32.9814 44.1103 34.7403 43.802 37.0078C43.4978 39.2453 43.5 42.123 43.5 45.8242H45.5ZM60.5 29C56.7567 29 53.8498 28.9979 51.59 29.2984C49.3026 29.6026 47.5287 30.2329 46.14 31.6064L47.5463 33.0284C48.5007 32.0845 49.784 31.5561 51.8536 31.2809C53.9509 31.0021 56.7008 31 60.5 31V29ZM117.203 55.9923L90.2032 29.289L88.7968 30.711L115.797 57.4143L117.203 55.9923Z"
        fill="url(#paint1_linear_22874_4831)"
      />
      <circle cx="80.5" cy="115" r="20" fill="#1676FE" />
      <path
        d="M79 108C79 107.172 79.6716 106.5 80.5 106.5C81.3284 106.5 82 107.172 82 108V113.5H87.5C88.3284 113.5 89 114.172 89 115C89 115.828 88.3284 116.5 87.5 116.5H82V122C82 122.828 81.3284 123.5 80.5 123.5C79.6716 123.5 79 122.828 79 122V116.5H73.5C72.6716 116.5 72 115.828 72 115C72 114.172 72.6716 113.5 73.5 113.5H79V108Z"
        fill="#282828"
      />
      <path
        d="M79 108C79 107.172 79.6716 106.5 80.5 106.5C81.3284 106.5 82 107.172 82 108V113.5H87.5C88.3284 113.5 89 114.172 89 115C89 115.828 88.3284 116.5 87.5 116.5H82V122C82 122.828 81.3284 123.5 80.5 123.5C79.6716 123.5 79 122.828 79 122V116.5H73.5C72.6716 116.5 72 115.828 72 115C72 114.172 72.6716 113.5 73.5 113.5H79V108Z"
        fill="white"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_22874_4831"
        x1="80"
        y1="0"
        x2="80"
        y2="159"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F4F4F5" />
        <stop offset="1" stopColor="#FBFBFB" stopOpacity="0.32" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_22874_4831"
        x1="80.5"
        y1="30"
        x2="80.5"
        y2="120"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#CCCCCC" stopOpacity="0.74" />
        <stop offset="1" stopColor="#BDBDBD" />
      </linearGradient>
      <clipPath id="clip0_22874_4831">
        <rect width="159" height="159" fill="white" transform="translate(0.5)" />
      </clipPath>
    </defs>
  </svg>
);

const NoData = (props: NoDataProps) => {
  const { children, description } = props;
  const { t } = useTranslation();
  return (
    <Empty
      image={<EmptySvgIcon />}
      imageStyle={{ height: 160 }}
      description={
        <>
          <h3 className="header-text">{t('No data available')}</h3>
          {description && <p className="info-text">{description}</p>}
        </>
      }
    >
      {children}
    </Empty>
  );
};

export { NoData, EmptySvgIcon };
