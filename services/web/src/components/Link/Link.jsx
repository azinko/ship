import { memo } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { Anchor } from '@mantine/core';

const linkStyles = ({ colors }) => ({
  color: colors.blue[5],
  display: 'flex',
  gap: '5px',
  pointerEvents: 'none',
  '&:hover': {
    color: colors.blue[2],
  },
  '&[disabled]': {
    color: colors.brand[2],
  },
});

const Link = ({
  type,
  children,
  href,
  size,
  disabled,
  inNewTab,
  underline,
  icon,
  inherit,
  align,
}) => {
  switch (type) {
    case 'router':
      return (
        <NextLink href={href}>
          <Anchor
            component="a"
            size={size}
            inherit={inherit}
            underline={underline}
            sx={linkStyles}
            align={align}
            disabled={disabled}
          >
            {icon}
            {children}
          </Anchor>
        </NextLink>
      );

    case 'url':
      return (
        <Anchor
          href={href}
          target={inNewTab ? '_blank' : '_self'}
          rel="noreferrer"
          size={size}
          inherit={inherit}
          underline={underline}
          sx={linkStyles}
          align={align}
          disabled={disabled}
        >
          {icon}
          {children}
        </Anchor>
      );
    default:
      return null;
  }
};

Link.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  href: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  icon: PropTypes.node,
  inNewTab: PropTypes.bool,
  underline: PropTypes.bool,
  inherit: PropTypes.bool,
  disabled: PropTypes.bool,
};

Link.defaultProps = {
  type: 'url',
  href: '#',
  size: 'md',
  icon: null,
  inNewTab: false,
  underline: true,
  disabled: false,
  inherit: false,
  align: 'left',
};

export default memo(Link);
