"use client";

import { useEffect, useState } from "react";
import styles from "./heart-input.module.scss";

type Props = {
    id?: string;
    name?: string;
    liked: boolean;
    onChange?: (liked: boolean) => void;
    disabled?: boolean;
    heartSize?: string;
};

const HeartInput = ({
    id,
    name,
    liked,
    onChange,
    disabled,
    heartSize,
}: Props) => {

    const handleClick = () => {
        if (disabled) return;
        if (onChange) onChange(liked)
    }

    return (
        <div className={`${styles.container} ${disabled ? styles.disabled : ""}`}>
            <div style={{ fontSize: heartSize }} onClick={() => handleClick()}> {liked ? (<i className="fa-solid fa-heart"></i>) : (<i className="fa-regular fa-heart"></i>)}</div>
        </div >
    );
};


export default HeartInput;
