import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { LoaderIcon, MapPinIcon, ShipWheelIcon, CameraIcon, ShuffleIcon } from "lucide-react";
import { LANGUAGES } from "../constants";

const Onboarding = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  return (
    <div className="min-h-screen max-w-full flex items-center justify-center p-4 bg-[#f6fafd]">
      <div className="w-full max-w-6xl mx-auto rounded-xl shadow-lg overflow-hidden border border-[#3498db]/25 bg-white flex flex-col lg:flex-row">
        {/* LEFT: FORM SECTION */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
          {/* LOGO & HEADER */}
          <div className="flex items-center gap-2 mb-6">
            <ShipWheelIcon className="size-8 text-[#3498db]" />
            <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-[#3498db] to-[#3498db] tracking-wider">
              Streamify
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-sm opacity-70 mb-6">Tell us a bit about yourself to get started on your language journey!</p>

          <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-3">
              {/* IMAGE PREVIEW */}
              <div className="size-28 rounded-full border-4 border-[#3498db]/30 shadow-sm bg-[#eaf6fb] overflow-hidden flex items-center justify-center">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-10 text-[#3498db] opacity-40" />
                  </div>
                )}
              </div>
              {/* Generate Random Avatar BTN */}
              <button type="button" onClick={handleRandomAvatar} className="btn btn-sm bg-[#3498db] text-white border-none hover:bg-[#217dbb] flex items-center gap-2">
                <ShuffleIcon className="size-4" />
                Random Avatar
              </button>
            </div>

            {/* FULL NAME */}
            <div className="form-control flex flex-col w-full">
              <label className="label mb-1">
                <span className="label-text text-black font-medium">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* BIO */}
            <div className="form-control flex flex-col w-full">
              <label className="label mb-1">
                <span className="label-text text-black font-medium">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered w-full h-20"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {/* NATIVE LANGUAGE */}
              <div className="form-control flex flex-col w-full">
                <label className="label mb-1">
                  <span className="label-text text-black font-medium">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              {/* LEARNING LANGUAGE */}
              <div className="form-control flex flex-col w-full">
                <label className="label mb-1">
                  <span className="label-text text-black font-medium">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOCATION */}
            <div className="form-control flex flex-col w-full">
              <label className="label mb-1">
                <span className="label-text text-black font-medium">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-[#3498db] opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button className="btn w-full bg-[#3498db] text-white border-none hover:bg-[#217dbb]" disabled={isPending} type="submit">
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
        {/* RIGHT: ILLUSTRATION & MOTIVATION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-[#eaf6fb] items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-xs mx-auto">
              <img src="/onboard.gif" alt="Language connection illustration" className="w-full h-full" />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold text-[#3498db]">Connect & Grow</h2>
              <p className="opacity-70">
                Meet language partners, make friends, and improve your skills together. Your journey starts here!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Onboarding;