import type { IconType } from "react-icons";
import clsxm from "../../../lib/clsxm";
import React from "react";
import { ImSpinner2 } from "react-icons/im";

const ButtonVariant = [ "primary", "outline", "light", "dark" ] as const;
const ButtonSize = [ "sm", "base" ] as const;

type ButtonProps = {
  isLoading?: boolean;
  isDarkBg?: boolean;
  variant?: ( typeof ButtonVariant )[ number ];
  size?: ( typeof ButtonSize )[ number ];
  leftIcon?: IconType;
  rightIcon?: IconType;
  leftIconClassName?: string;
  rightIconClassName?: string;
  rounded?: boolean;
} & React.ComponentPropsWithRef<"button">;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled: buttonDisabled,
      isLoading,
      variant = "primary",
      size = "base",
      isDarkBg = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      leftIconClassName,
      rightIconClassName,
      rounded,
      ...rest
    },
    ref
  ) => {
    const disabled = isLoading || buttonDisabled;

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={clsxm(
          "inline-flex items-center font-medium",
          "focus-visible:ring-primary-500 focus:outline-none focus-visible:ring",
          "shadow-sm",
          "transition-colors duration-75",
          //#region  //*=========== Rounded ===========
          [ rounded ? "rounded-3xl" : "rounded" ],
          //#region  //*=========== Size ===========
          [
            size === "base" && [ "px-3 py-1.5", "text-sm md:text-base" ],
            size === "sm" && [ "px-2 py-1", "text-xs md:text-sm" ],
          ],
          //#endregion  //*======== Size ===========
          //#region  //*=========== Variants ===========
          [
            variant === "primary" && [
              "bg-indigo-500 text-white",
              "bg-indigo-500 border",
              "hover:bg-indigo-700 hover:text-white",
              "active:bg-indigo-700",
              "disabled:bg-indigo-700",
            ],
            variant === "outline" && [
              "text-orange-500",
              "border-orange-500 border",
              "hover:bg-orange-50 active:bg-orange-100 disabled:bg-orange-100",
              isDarkBg &&
              "hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800",
            ],
            variant === "light" && [
              "bg-white text-gray-700",
              "border border-gray-300",
              "hover:text-dark hover:bg-gray-100",
              "active:bg-white/80 disabled:bg-gray-200",
            ],
            variant === "dark" && [
              "bg-gray-900 text-white",
              "border border-gray-600",
              "hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-700",
            ],
          ],
          //#endregion  //*======== Variants ===========
          "disabled:cursor-not-allowed",
          isLoading &&
          "relative text-transparent transition-none hover:text-transparent disabled:cursor-wait",
          className
        )}
        {...rest}
      >
        {isLoading && (
          <div
            className={clsxm(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              {
                "text-white": [ "primary", "dark" ].includes( variant ),
                "text-black": [ "light" ].includes( variant ),
                "text-primary-500": [ "outline", "ghost" ].includes( variant ),
              }
            )}
          >
            <ImSpinner2 className="animate-spin" />
          </div>
        )}
        {LeftIcon && (
          <div
            className={clsxm( [
              size === "base" && "mr-1",
              size === "sm" && "mr-1.5",
            ] )}
          >
            <LeftIcon
              className={clsxm(
                [
                  size === "base" && "md:text-md text-md",
                  size === "sm" && "md:text-md text-sm",
                ],
                leftIconClassName
              )}
            />
          </div>
        )}
        {children}
        {RightIcon && (
          <div
            className={clsxm( [
              size === "base" && "ml-1",
              size === "sm" && "ml-1.5",
            ] )}
          >
            <RightIcon
              className={clsxm(
                [
                  size === "base" && "text-md md:text-md",
                  size === "sm" && "md:text-md text-sm",
                ],
                rightIconClassName
              )}
            />
          </div>
        )}
      </button>
    );
  }
);

export default Button;