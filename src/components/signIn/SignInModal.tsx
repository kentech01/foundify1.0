/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./signIn.module.scss";
import { UserAuth } from "../../context/AuthContext";
// import { FacebookLoginButton } from "react-social-login-buttons";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess?: () => void; // Add optional callback
}

function SignInModal({ isOpen, onClose, onSignInSuccess }: SignInModalProps) {
  const { googleSignIn, loading, user } = UserAuth();
  const navigate = useNavigate();

  // Close modal when clicking outside
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close modal on escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();

      onSignInSuccess?.();
    } catch (error) {
      console.log(error);
    }
  };

  // const handleFacebookSignIn = async () => {
  //   try {
  //     await facebookSignIn();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.signInWrap}>
          <h1 className={styles.signInTitle}>Welcome</h1>
          <p className={styles.instructionText}>
            Sign in to get your perfect pitch
          </p>
          <button
            className={styles.googleButton}
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <div className={styles.googleLogo}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path
                  fill="#4285F4"
                  d="M17.785 9.169c0-.738-.06-1.276-.189-1.834h-8.42v3.328h4.842c-.1.828-.638 2.328-1.834 3.263l2.953 2.258c1.732-1.591 2.648-3.925 2.648-7.015z"
                />
                <path
                  fill="#34A853"
                  d="M9.175 17.938c2.476 0 4.568-.828 6.09-2.258l-2.953-2.258c-.828.552-1.89.922-3.137.922-2.414 0-4.463-1.63-5.195-3.823l-3.038 2.338c1.52 3.025 4.647 5.079 8.233 5.079z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.98 10.521c-.18-.552-.282-1.14-.282-1.75s.102-1.198.282-1.75L.932 4.254C.332 5.514 0 6.904 0 8.271s.332 2.757.932 4.017l3.048-2.338z"
                />
                <path
                  fill="#EA4335"
                  d="M9.175 3.077c1.365 0 2.314.552 2.845 1.012l2.078-2.078C13.74.89 11.651 0 9.175 0 5.589 0 2.462 2.054.932 5.254l3.048 2.338C4.712 4.707 6.761 3.077 9.175 3.077z"
                />
              </svg>
            </div>
            <span>Continue with Google</span>
          </button>
          <p className={styles.legalText}>
            By signing in, you agree to our{" "}
            <a
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                navigate("/terms");
              }}
              className={styles.termsLink}
            >
              Terms & Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignInModal;
