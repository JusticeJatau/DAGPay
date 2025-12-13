// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  // Identification
  id: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  account_type: { 
    type: String, 
    enum: ["individual", "organization"], 
    required: true 
  },
  
  // Authentication
  password: { 
    type: String, 
    required: true 
  },
  
  // Common Fields
  phone: { 
    type: String, 
    required: true 
  },
  is_verified: { 
    type: Boolean, 
    default: false 
  },
  
  // Individual User Fields
  full_name: { 
    type: String, 
    default: null 
  },
  
  // Organization User Fields
  organization_name: { 
    type: String, 
    default: null 
  },
  cac_number: { 
    type: String, 
    default: null 
  },
  contact_person: { 
    type: String, 
    default: null 
  },
  organization_email: { 
    type: String, 
    default: null 
  },
  
  // Verification & Reset
  verification_token: { 
    type: String, 
    default: null 
  },
  verification_expires: { 
    type: Date, 
    default: null 
  },
  reset_password_token: { 
    type: String, 
    default: null 
  },
  reset_password_expires: { 
    type: Date, 
    default: null 
  },
  
  // Status & Timestamps
  status: { 
    type: String, 
    enum: ["active", "suspended", "pending"], 
    default: "pending" 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Hash password before saving
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.updated_at = Date.now();
});


// Method to check password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Add index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ id: 1 });
UserSchema.index({ verification_token: 1 });
UserSchema.index({ reset_password_token: 1 });

export default mongoose.model("User", UserSchema);