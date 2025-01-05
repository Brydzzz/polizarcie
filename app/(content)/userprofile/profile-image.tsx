'use client';

import React from 'react';
import SupabaseImage from "@/components/images/supabase-image.component";

interface ClientSupabaseImageProps {
    src?: string;
}

const ClientSupabaseImage: React.FC<ClientSupabaseImageProps> = ({ src }) => {
    return (
        <>
            {src ? (
                <SupabaseImage
                    src={src}
                    width={200}
                    height={200}
                    alt="image error"
                />
            ) : (
                <img src="https://cdn-icons-png.flaticon.com/512/10337/10337609.png" width={200} height={200} alt="default image" />
            )}
        </>
    );
};

export default ClientSupabaseImage;
