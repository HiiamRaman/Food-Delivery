import { useState } from "react";
import './PasswordInput.css'
export default function PasswordInput({
  value,
  onChange,
  placeholder
}) {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-wrapper">

      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? "🙈" : "👁️"}
      </button>

    </div>
  );
}