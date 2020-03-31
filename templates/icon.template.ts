export const iconTemplate = `/**
 * This is auto-generated file by scripts/generate.ts
 * Do not edit it manually
 */
import React from 'react';

type Props = {
    className?: string;
};

export const {{ComponentName}}: React.FC<Props> = ({ className }) => (
    {{body}}
);

export default {{ComponentName}};
`;
