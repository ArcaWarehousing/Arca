"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/nav/navbar";
import Sidebar from "../components/sidebar";
const Cookies = require("js-cookie");

function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [verifiedToSell, setVerifiedToSell] = useState(false);
  const [verifiedToBuy, setVerifiedToBuy] = useState(false);
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [verificationRequested, setVerificationRequested] = useState(false);
  const router = useRouter();

  const authToken = Cookies.get("authToken");

  // const fetchData = useCallback(async () => {
  // try {
  //   if (!authToken) {
  //     console.log("REDIRECTING TO SIGNIN");
  //     router.push("/signin");
  //   } else {
  //     const response = await fetch(
  //       process.env.NEXT_PUBLIC_APIROUTE + ":9000/api/user/getProfile",
  //       {
  //         credentials: "include",
  //       }
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       setFirstName(data.firstName);
  //       setLastName(data.lastName);
  //       setEmail(data.email);
  //       setPhoneNumber(data.phoneNumber);
  //       setCompanyName(data.companyName);
  //       setVerifiedToSell(data.verifiedToSell);
  //       setVerifiedToBuy(data.verifiedToBuy);
  //       setVerificationRequested(data.verificationRequested);
  //       // Handle insuranceFile if needed
  //       console.log("Data fetched successfully", data);
  //     } else {
  //       console.error("Error fetching data");
  //     }
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
  // }, [authToken, router]);

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  const handleChange = (setter: React.SetStateAction<any>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setVerificationRequested(false);
    saveChanges(false);
  };


  const saveChanges = async (verificationRequested: boolean) => {
    const data = {
      firstName,
      lastName,
      email,
      phoneNumber,
      companyName,
      insuranceFile,
      verificationRequested: verificationRequested
    };
    console.log("Saving changes:", data);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_APIROUTE + ":9000/api/user/updateProfile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        // console.log("Profile updated successfully", responseData);

        if (insuranceFile) {
          // Handle file upload if needed
          const formData = new FormData();
          formData.append("file", insuranceFile);

          await fetch(
            process.env.NEXT_PUBLIC_APIROUTE +
            ":9000/api/user/secureUploadUserInsurance",
            {
              method: "PUT",
              credentials: "include",
              body: formData,
            }
          );
          console.log("File uploaded successfully");
        }
      } else {
        const errorData = await response.json();
        console.error("Error updating profile", errorData);
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };



  const requestVerification = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_APIROUTE + ":9000/api/user/requestVerification",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        setVerificationRequested(true);
        saveChanges(true);
        alert("Verification request sent.");
      }
    } catch (error) {
      console.error("Error requesting verification", error);
    }
  };

  return (
    <>
      <div className="flex w-full diagonal-background">
        <div>
          <Sidebar />
        </div>
        <div className="max-w-md w-full bg-gray-50 rounded-xl p-7 mx-auto gap-7 h-[700px] drop-shadow-xl mt-24 space-y-6 items-center justify-center">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Update and Change Profile
          </h2>
          <div className="mt-4">
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="firstName" className="sr-only">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={handleChange(setFirstName)}
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border-2 border-indigo-500 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-base"
                  placeholder="First Name"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="lastName" className="sr-only">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={lastName}
                  onChange={handleChange(setLastName)}
                  className="appearance-none rounded-lg mb-4 w-full px-4 py-3 border-2 border-indigo-500 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-base"
                  placeholder="Last Name"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange(setEmail)}
                  className="appearance-none rounded-lg mb-4 relative block w-full px-4 py-3 border-2 border-indigo-500 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-base"
                  placeholder="Email"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="sr-only">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={handleChange(setPhoneNumber)}
                  className="appearance-none rounded-lg mb-4 relative block w-full px-4 py-3 border-2 border-indigo-500 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-base"
                  placeholder="Phone Number"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="companyName" className="sr-only">
                  Company Name
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={companyName}
                  onChange={handleChange(setCompanyName)}
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border-2 border-indigo-500 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-base"
                  placeholder="Company Name"
                />
              </div>
              <div className="mb-4 flex items-center justify-between">
                <label
                  htmlFor="verifiedToSell"
                  //this needs ux/ui update. This is not a user input but appears to be one
                  className="text-lg font-medium text-gray-700"
                >
                  Verified to Sell
                </label>
                <input
                  id="verifiedToSell"
                  name="verifiedToSell"
                  type="checkbox"
                  disabled
                  checked={verifiedToSell}
                  className="mt-1 mb-4 sm:text-sm rounded-md"
                />
              </div>
              <div className="mb-4 flex items-center justify-between">
                <label
                  htmlFor="verifiedToBuy"
                  className="text-lg font-medium text-gray-700 mb-4"
                >
                  Verified to Buy
                </label>
                <input
                  //this needs ux/ui update. This is not a user input but appears to be one
                  id="verifiedToBuy"
                  name="verifiedToBuy"
                  type="checkbox"
                  disabled
                  checked={verifiedToBuy}
                  className="mt-1 sm:text-sm rounded-md mb-4"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="insuranceFile"
                  className="block text-lg font-medium text-gray-700 mb-4"
                >
                  Proof of Company Affiliation (Insurance File)
                </label>
                {insuranceFile && (
                  <a
                    href={URL.createObjectURL(insuranceFile)}
                    download={`${firstName}_${lastName}_insurance.pdf`}
                    className="text-blue-500 underline"
                  >
                    Download File
                  </a>
                )}
                <input
                  id="insuranceFile"
                  name="insuranceFile"
                  type="file"
                  onChange={(e) =>
                    setInsuranceFile(
                      (e.target.files && e.target.files[0]) || null
                    )
                  }
                  accept=".pdf,.doc,.docx"
                  className="mt-2 sm:text-sm rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={requestVerification}
                disabled={verificationRequested}
              >
                Request Verification
              </button>
            </div>
            {!verificationRequested ? (<p>Further edits have been made. You need to request verification again.</p>) : (<p>Verification request sent</p>)}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;