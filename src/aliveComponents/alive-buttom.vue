<template>
    <buttom>
        <slot />
    </buttom>
</template>
<style scoped>
    buttom{
display: inline-flex;
outline: none;
line-height: var(--type-ramp-base-line-height);
color: var(--neutral-foreground-rest);
fill: currentcolor;
cursor: pointer;
min-width: 0px;
z-index: 303;
opacity: 1;
font-family: "Segoe UI";
padding: 4px 6px;
font-size: 14px;
font-weight: 600;
border: 1px solid lightgray;
border-radius:6px;
--neutral-foreground-rest: #262626;
--type-ramp-base-line-height: 20px;
background: rgba(255, 255, 255, 0.5);
backdrop-filter: blur(3px);
    }
</style>