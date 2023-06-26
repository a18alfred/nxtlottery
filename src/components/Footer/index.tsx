import React from 'react';
import styled from 'styled-components';
import { cardBgColor, secondaryText } from '../../constants/colors';
import { useTranslation } from 'react-i18next';
import { socialLinks } from '../../constants/socialLinks';

export const FooterContainer = styled.footer`
  margin-top: auto;
  width: 100%;
  max-width: 1200px;
  margin-right: auto;
  margin-left: auto;
  padding: 0 2rem;

  @media screen and (max-width: 880px) {
    display: none;
  }
`;

export const FooterWrap = styled.div`
  padding-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const WebsiteRights = styled.small`
  color: ${secondaryText};
  font-size: 14px;
  font-weight: 500;
`;

export const SocialIcons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1.5rem;
`;

export const SocialIconLink = styled.a`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 50%;
  background: ${cardBgColor};
  color: ${secondaryText};
  font-size: 18px;
`;


const Footer = () => {
	const { t } = useTranslation();
	return (
		<FooterContainer>
			<FooterWrap>
				<WebsiteRights>
					© {new Date().getFullYear()} NxtLottery. {t('all_rights_reserved')}
				</WebsiteRights>
				<SocialIcons>
					{
						socialLinks.map((social, index) => (
							<SocialIconLink
								key={index}
								href={social.href}
								target='_blank'
								area-label={social.name}
							>
								<social.icon />
							</SocialIconLink>
						))
					}
				</SocialIcons>
			</FooterWrap>
		</FooterContainer>
	);
};

export default Footer;
