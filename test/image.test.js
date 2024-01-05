jest.mock("../models/image.js");
import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";
import dotenv from "dotenv";
import { Patient } from "../models/image.js";
import {getKeycloakToken} from "./keycloak.js"

dotenv.config()

let token = ""

beforeAll(async () => {
  token = await getKeycloakToken();
  console.log(token.charAt(0))
})


/* Connect to db before test */
beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

/* Close connection after each test */
afterEach(async () => {
  await mongoose.connection.close();
});

describe("POST /image", () => {
  it("should create a new image and a patient if the patient doesn't exist", async () => {
    Patient.findOne.mockResolvedValue(null);
    //const token = await getKeycloakToken()

    console.log("Token: ", token.toString().charAt(0))


    const file = Buffer.from("fake_image_data");
    const response = await request(app)
      .post("/image")
      .field("patientId", "12345")
      .field("description", "Test Description")
      .attach("image", file, "test.png")
      .set('Authorization', `Bearer ${token}`);



    console.log(response.body)


    expect(response.statusCode).toBe(200);
    expect(Patient.findOne).toHaveBeenCalledWith({ patientId: "12345" });

    expect(Patient.prototype.save).toHaveBeenCalled();
  });
});

describe("PUT /image", () => {
  it("should alter the image if the patient id exists", async () => {
    // Mock the findOne function to return a patient
    //const token = await getKeycloakToken()
    const mockPatient = {
      _id: new mongoose.Types.ObjectId(),
      patientId: "12345",
      images: [
        {
          _id: new mongoose.Types.ObjectId(), // Replace with an actual image ID
          description: "Initial Description",
          data: Buffer.from("fake_image_data_1"),
          contentType: "image/png",
        },
      ],
      save: jest.fn().mockResolvedValue({}), // Mock the save function
    };

    Patient.findOne.mockResolvedValue(mockPatient); // Mock findOne to return the mock patient

    // Prepare the request data
    const file = Buffer.from("fake_image_data_updated");
    const response = await request(app)
      .put("/image")
      .field("patientId", "12345")
      .field("description", "Updated Description")
      .field("imageId", mockPatient.images[0]._id.toString())
      .attach("image", file, "updated.png")
      .set('Authorization', `Bearer ${token}`);



    console.log(response.body)


    expect(response.statusCode).toBe(200);
    expect(Patient.findOne).toHaveBeenCalledWith({ patientId: "12345" });

    // Assert that the image was updated in the patient's images array
    expect(mockPatient.images[0].description).toBe("Updated Description");
    expect(mockPatient.images[0].data.toString()).toBe(file.toString());
    expect(mockPatient.images[0].contentType).toBe("image/png");

    // Assert that save was called on the mockPatient
    expect(mockPatient.save).toHaveBeenCalled();

    // Add more assertions as necessary
  });
});

describe("GET image data", () => {
  it("should get information about all images of a specific patient", async () => {
    const mockPatient = {
      _id: "mockMongoId",
      patientId: "12345",
      images: [
        {
          _id: "image1", // Replace with an actual image ID
          description: "Description 1",
          data: Buffer.from("fake_image_data_1"),
          contentType: "image/png",
        },
      ],
      save: jest.fn().mockResolvedValue({}), // Mock the save function
    };

    Patient.findOne.mockResolvedValue(mockPatient); // Mock findOne to return the mock patient
    //const token = await getKeycloakToken()
    const response = await request(app).get("/image/data?patientId=12345").set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    console.log(response.body);

    expect(Patient.findOne).toHaveBeenCalledWith({ patientId: "12345" });

    expect(response.body).toEqual({
      mongoId: "mockMongoId",
      patientId: "12345",
      images: [
        {
          imageId: "image1",
          description: "Description 1",
          contentType: "image/png",
        },
      ],
    });
  });
});

describe("GET /image", () => {
  it("should return image data for a given image ID", async () => {
    const mockImage = {
      _id: new mongoose.Types.ObjectId(),
      description: "Test Image",
      contentType: "image/jpeg",
      data: Buffer.from("testImageData"),
    };

    const mockPatient = {
      _id: new mongoose.Types.ObjectId(),
      images: [mockImage],
      save: jest.fn().mockResolvedValue({}),
    };

    Patient.findOne.mockResolvedValue(mockPatient);
    //const token = await getKeycloakToken()
    const response = await request(app).get(
      "/image?imageId=" + mockImage._id + "&mongoId=" + mockPatient._id
    ).set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      description: "Test Image",
      contentType: "image/jpeg",
      base64Image: mockImage.data.toString("base64"),
    });
  });

  // Additional tests for scenarios like image not found, patient not found, etc.
});

describe("Delete /image/:patientId", () => {
  it("should delete all images for a user if the user exists", async () => {
    const mockPatient = {
      _id: new mongoose.Types.ObjectId(),
      patientId: "12345",
      images: [
        {
          _id: new mongoose.Types.ObjectId(),
          description: "Test Image1",
          contentType: "image/jpeg",
          data: Buffer.from("testImageData1"),
        },
        {
          _id: new mongoose.Types.ObjectId(),
          description: "Test Image2",
          contentType: "image/jpeg",
          data: Buffer.from("testImageData2"),
        },
      ],
      save: jest.fn().mockResolvedValue({}),
    };

    Patient.findOne.mockResolvedValue(mockPatient);
    //const token = await getKeycloakToken()
    let response = await request(app).delete("/image/:" + mockPatient._id).set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);

    Patient.findOne.mockResolvedValue(null);
    response = await request(app).delete(
      "/image/:" + new mongoose.Types.ObjectId()
    ).set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  });
});

describe("Delete /image/", () => {
  it("should delete one image from a user given mongoId for patient and image", async () => {
    const mockPatient = {
      _id: new mongoose.Types.ObjectId(),
      patientId: "12345",
      images: [
        {
          _id: new mongoose.Types.ObjectId(),
          description: "Test Image1",
          contentType: "image/jpeg",
          data: Buffer.from("testImageData1"),
        },
      ],
      save: jest.fn().mockResolvedValue({}),
    };

    Patient.findOne.mockResolvedValue(mockPatient)
    //const token = await getKeycloakToken()
    const response = await request(app)
      .delete("/image")
      .query({
        patientId: mockPatient.patientId.toString(),
        imageId: mockPatient.images[0]._id.toString(),
      }).set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Patient.findOne).toHaveBeenCalledWith({ patientId: mockPatient.patientId });
    expect(mockPatient.save).toHaveBeenCalled();

    // ... any additional assertions ...
  });
});

// ... rest of your test code ...
