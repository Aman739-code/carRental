import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;
const carSchema = new mongoose.Schema(
  {
    owner: { type: ObjectId, ref: "User" },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    image: { type: String, required: true },
    year: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "sedan",
        "suv",
        "hatchback",
        "coupe",
        "convertible",
        "van",
        "truck",
        "other",
      ],
    }, // enum to restrict categories
    seating_capacity: { type: Number, required: true },
    fuelType: { type: String, required: true },
    transmission: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes to speed up queries for listing/filtering/sorting
carSchema.index({ isAvailable: 1 });
carSchema.index({ location: 1 });
carSchema.index({ pricePerDay: 1 });
carSchema.index({ category: 1 });
carSchema.index({ owner: 1 });
carSchema.index({ brand: 1 });

const car = mongoose.model("Car", carSchema);

export default car;
