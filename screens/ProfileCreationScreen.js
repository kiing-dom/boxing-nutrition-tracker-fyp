import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import RNPickerSelect from "react-native-picker-select";

export default function Stepper() {
  // for step control
  const [step, setStep] = useState(1);
  // step 1: boxing information
  const [boxingLevel, setBoxingLevel] = useState("");
  const [gender, setGender] = useState("");
  const [weightClass, setWeightClass] = useState("");
  // state variables to track selection status
  const [isGenderSelected, setIsGenderSelcted] = useState(false);
  const [isBoxingLevelSelected, setIsBoxingLevelSelected] = useState(false);
  const [isWeightClassSelected, setIsWeightClassSelected] = useState(false);

  //update selection status when a field is selected
  const handleGenderSelection = (value) => {
    setGender(value);
    setIsGenderSelcted(value !== null);
  };

  const handleBoxingLevelSelection = (value) => {
    setBoxingLevel(value);
    setIsBoxingLevelSelected(value !== null);
  };

  const handleWeightClassSelection = (value) => {
    setWeightClass(value);
    setIsWeightClassSelected(value !== null);
  };
  

  //enable the "Next Button when all fields have a selection"
  const isNextButtonEnabled = isGenderSelected && isBoxingLevelSelected && isWeightClassSelected;

  const getWeightClasses = () => {
    if (boxingLevel === 'Amateur' && gender === 'Male') {
        return [
            { label: 'Minimumweight - 105.8 lbs (48 kg)', value: 'Minimumweight' },
            { label: 'Flyweight - 112.4 lbs (51 kg)', value: 'Flyweight' },
            { label: 'Bantamweight - 119 lbs (54 kg)', value: 'Bantamweight' },
            { label: 'Featherweight - 126 lbs (57 kg)', value: 'Featherweight' },
            { label: 'Lightweight - 132.3 lbs (60 kg)', value: 'Lightweight' },
            { label: 'Light Welterweight - 140 lbs (63.5 kg)', value: 'Light Welterweight' },
            { label: 'Welterweight - 147 lbs (67 kg)', value: 'Welterweight' },
            { label: 'Light Middleweight - 156.5 lbs (71 kg)', value: 'Light Middleweight' },
            { label: 'Middleweight - 165.3 lbs (75 kg)', value: 'Middleweight' },
            { label: 'Light Heavyweight - 176.4 lbs (80 kg)', value: 'Light Heavyweight' },
            { label: 'Cruiserweight - 189.6 lbs (86 kg)', value: 'Cruiserweight'},
            { label: 'Heavyweight - 200.6 lbs (92 kg)', value: 'Heavyweight'},
            { label: 'Super Heavyweight - 200.6 lbs+ (92 kg+)', value: 'Super Heavyweight'},
        ];
    } else if (boxingLevel === 'Amateur' && gender === 'Female') {
        return [
            { label: 'Mininumweight - 105.8 lbs (48 kg)', value: 'Minimumweight' },
            { label: 'Light Flyweight - 110.2 lbs (50 kg)', value: 'Light Flyweight' },
            { label: 'Flyweight - 114.6 lbs (52 kg)', value: 'Flyweight' },
            { label: 'Bantamweight - 119 lbs (54 kg)', value: 'Bantamweight' },
            { label: 'Featherweight - 125.7 lbs (57 kg)', value: 'Featherweight' },
            { label: 'Lightweight - 132.3 lbs (60 kg', value: 'Lightweight' },
            { label: 'Light Welterweight - 138.9 lbs (63 kg)', value: 'Light Welterweight' },
            { label: 'Welterweight - 145.5 lbs (66 kg)', value: 'Welterweight' },
            { label: 'Light Middleweight - 154.3 lbs (70 kg)', value: 'Light Middleweight' },
            { label: 'Middleweight - 165.3 lbs (75 kg)', value: 'Middleweight' },
            { label: 'Light Heavyweight - 178.6 lbs (81 kg)', value: 'Light Heavyweight' },
            { label: 'Heavyweight - 178.6 lbs+ (81 kg+)', value: 'Heavyweight'},
        ];
    } else if (boxingLevel === 'Professional' && gender === 'Male') {
        return [
            { label: 'Minimumweight - 105 lbs (47.6 kg)', value: 'Minimumweight' },
            { label: 'Light Flyweight - 108 lbs (49 kg)', value: 'Light Flyweight' },
            { label: 'Flyweight - 112 lbs (50.8 kg)', value: 'Flyweight' },
            { label: 'Super Flyweight - 115 lbs (52.1 kg)', value: 'Super Flyweight' },
            { label: 'Bantamweight - 118 lbs (53.5 kg)', value: 'Bantamweight' },
            { label: 'Super Bantamweight - 122 lbs (55.3 kg)', value: 'Super Bantamweight' },
            { label: 'Featherweight - 126 lbs (57.1 kg)', value: 'Featherweight' },
            { label: 'Super Featherweight - 130 lbs (59 kg)', value: 'Super Featherweight' },
            { label: 'Lightweight - 135 lbs (61.2 kg)', value: 'Lightweight' },
            { label: 'Super Lightweight - 140 lbs (63.5 kg)', value: 'Super Lightweight' },
            { label: 'Welterweight - 147 lbs (66.7 kg)', value: 'Welterweight' },
            { label: 'Super Welterweight - 154 lbs (69.9 kg)', value: 'Super Welterweight' },
            { label: 'Middleweight - 160 lbs (72.5 kg)', value: 'Middleweight' },
            { label: 'Super Middleweight - 168 lbs (76.2 kg)', value: 'Super Middleweight' },
            { label: 'Light Heavyweight - 175 lbs (79.4 kg)', value: 'Light Heavyweight' },
            { label: 'Cruiserweight - 200 lbs (90.7 kg)', value: 'Cruiserweight' },
            { label: 'Heavyweight - Unlimited', value: 'Heavyweight' },
        ];
    } else if (boxingLevel === 'Professional' && gender === 'Female') {
        return [
            { label: 'Atomweight - 95 lbs (43 kg) or less', value: 'Atomweight' },
            { label: 'Strawweight - 105 lbs (47.6 kg)', value: 'Strawweight' },
            { label: 'Mini-Flyweight - 108 lbs (49 kg)', value: 'Mini-Flyweight' },
            { label: 'Flyweight - 112 lbs (50.8 kg)', value: 'Flyweight' },
            { label: 'Super Flyweight - 115 lbs (52.1 kg)', value: 'Super Flyweight' },
            { label: 'Bantamweight - 118 lbs (53.5 kg)', value: 'Bantamweight' },
            { label: 'Super Bantamweight - 122 lbs (55.3 kg)', value: 'Super Bantamweight' },
            { label: 'Featherweight - 126 lbs (57.1 kg)', value: 'Featherweight' },
            { label: 'Super Featherweight - 130 lbs (59 kg)', value: 'Super Featherweight' },
            { label: 'Lightweight - 135 lbs (61.2 kg)', value: 'Lightweight' },
            { label: 'Light Welterweight - 140 lbs (63.5 kg)', value: 'Light Welterweight' },
            { label: 'Welterweight - 147 lbs (66.7 kg)', value: 'Welterweight' },
            { label: 'Light Middleweight - 152 lbs (69.0 kg)', value: 'Light Middleweight' },
            { label: 'Middleweight - 154 lbs (69.9 kg)', value: 'Middleweight' },
            { label: 'Super Middleweight - 160 lbs (72.5 kg)', value: 'Super Middleweight' },
            { label: 'Light Heavyweight - 168 lbs (76.2 kg)', value: 'Light Heavyweight' },
            { label: 'Super Cruiserweight - 175 lbs (79.4 kg)', value: 'Super Cruiserweight' },
            { label: 'Heavyweight - 165 lbs (74.8 kg) or more', value: 'Heavyweight' },
        ];
}
// default case
return [];
};

  //step ??
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ backgroundColor: "#E5E5E5", height: 2, marginBottom: 8 }}>
        <View
          style={{
            backgroundColor: "#5A67D8",
            height: 2,
            width: `${(step / 2) * 100}%`,
          }}
        />
      </View>

      {step === 1 && (
        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
            Step 1: Boxing Information
          </Text>

          <Text style={{ fontSize: 16, marginBottom: 4 }}>Gender</Text>
          {/* Picker to Select Gender */}
          <RNPickerSelect
            onValueChange={handleGenderSelection}
            items={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },            
            ]}
            value={gender}
          />

          <Text style={{ fontSize: 16, marginBottom: 4 }}>Boxing Level</Text>
          {/* Picker to Select Boxing Level */}
          <RNPickerSelect
            onValueChange={handleBoxingLevelSelection}
            items={[
              { label: "Amateur", value: "Amateur" },
              { label: "Professional", value: "Professional" },
            ]}
            value={boxingLevel}
          />

          {/* Picker to select desired weight class based on the selected Boxing Level and Gender */}
          <Text style={{ fontSize: 16, marginBottom: 4 }}>Desired Weight Class</Text>
          <RNPickerSelect
            onValueChange={handleWeightClassSelection}
            items={getWeightClasses()} // Use the function to get weight classes
            value={weightClass}
          />
          <Button title="Next" onPress={handleNextStep} color="#8868BD" disabled={!isNextButtonEnabled} />
        </View>
      )}

      {step === 2 && (
        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
            Step 2: Account Details
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 4 }}>Email</Text>
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 16,
              padding: 8,
            }}
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
          />
          <Text style={{ fontSize: 16, marginBottom: 4 }}>Password</Text>
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 16,
              padding: 8,
            }}
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />
          <View style={{ flexDirection: "row" }}>
            <Button
              title="Previous"
              onPress={handlePreviousStep}
              color="#7F7F7F"
            />
            <Button title="Finish" onPress={handleNextStep} color="#5A67D8" />
          </View>
        </View>
      )}
    </View>
  );
}
