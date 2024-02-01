import styled from "styled-components";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { defaultFont } from "@/styles.js";
import {
  toastDuration,
  validateTripDates,
  formatDateForInput,
} from "@/lib/utils";
import { ToastMessage } from "@/components/ToastMessage";
import {
  ButtonContainer,
  StyledTextButton,
} from "@/components/Button/TextButton";

const TripForm = styled.form`
  margin: 2rem auto;
  display: grid;
  gap: 0.3rem;
  padding: 1rem 1.6rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Label = styled.label`
  margin-top: 0.4rem;
  font-weight: bold;
  font-size: 0.9rem;
  color: var(--color-form-label);
`;

const Input = styled.input`
  padding: 0.5rem;
  font-family: ${defaultFont.style.fontFamily};
  font-size: inherit;
  background-color: var(--color-form-input);
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 0.1rem;
`;

const DateContainer = styled.fieldset`
  margin: 0;
  padding: 0;
  border-color: transparent;

  display: grid;
  grid-template-columns: 48% 48%;
  grid-template-rows: auto auto;
  gap: inherit;
  grid-auto-flow: column;
  justify-content: space-between;
`;

const PackListContainer = styled.fieldset`
  margin-top: 0.4rem;
  padding: 0;
  /* background-color: yellow; */
  border: none;
  max-width: auto;
`;

const PackList = styled.ul`
  margin: auto;
  padding: 0;
`;

const InputContainer = styled.li`
  display: grid;
  grid-template-columns: 8fr 2fr 1fr 1fr;
  gap: 6px;
  align-items: center;
  margin: 0;
  padding: 0;
  margin-top: 6px;
  width: 100%;
`;

const InputItem = styled(Input)`
  width: 100%;
  margin: 0; /* Add this line to remove any default margin */
  /* background-color: salmon; */
`;

const InputQuantity = styled(Input)`
  width: 100%;
  margin: 0; /* Add this line to remove any default margin */
  /* background-color: purple; */
`;

const StyledMiniButton = styled.div`
  margin: 0; /* Add this line to remove any default margin */
  display: flex;
  align-items: center;
  justify-content: center;
  justify-self: center;
  width: 1.8rem;
  height: 1.8rem;
  padding: 0.5rem;
  background-color: ${({ defaultColor }) => defaultColor};
  border: 0px;
  border-radius: 10px;
  color: ${({ textColor }) => textColor};
  font-family: ${defaultFont.style.fontFamily};
  font-size: ${({ fontSize }) => fontSize || "1rem"};
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  transition: color 0.3s ease, transform 0.3s ease;

  &:active,
  :visited {
    color: inherit;
  }

  &:hover {
    background-color: ${({ hoverColor }) => hoverColor};
    cursor: pointer;
    transform: scale(1.03);
  }
`;

export default function Form({ defaultData, isEditMode, onSubmit }) {
  const [handoverData, setHandoverData] = useState(defaultData);
  const [formDisabled, setFormDisabled] = useState(false);

  useEffect(() => {
    setHandoverData(defaultData);
  }, [defaultData]);

  function handleInput(event) {
    setHandoverData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  function handleAddItem() {
    setHandoverData((prev) => ({
      ...prev,
      packingList: [...prev.packingList, { itemName: "", itemQuantity: 1 }],
    }));
  }

  function handleUpdateItem(index, itemName, itemQuantity) {
    setHandoverData((prev) => {
      const updatedPackingList = [...prev.packingList];
      updatedPackingList[index] = { itemName, itemQuantity };
      return {
        ...prev,
        packingList: updatedPackingList,
      };
    });
  }

  function handleRemoveItem(index) {
    setHandoverData((prev) => {
      const updatedPackingList = [...prev.packingList];
      updatedPackingList.splice(index, 1);
      return {
        ...prev,
        packingList: updatedPackingList,
      };
    });
  }

  function handleReset() {
    toast.dismiss();
    setFormDisabled(true);
    if (handoverData === defaultData) {
      toast.error("No entries yet, nothing to reset.", {
        duration: toastDuration,
      });
      setFormDisabled(false);
      return;
    }
    toast(
      <ToastMessage
        message="Are you sure to reset form?"
        textConfirmButton="Yes, reset please."
        messageAfterConfirm="Ok, form reset."
        textCancelButton="No, don&rsquo;t reset!"
        messageAfterCancel="Ok, no reset."
        onConfirm={() => {
          setHandoverData(defaultData);
          setFormDisabled(false);
        }}
        onCancel={() => {
          setFormDisabled(false);
        }}
      />,
      { duration: Infinity }
    );
  }

  function handleDiscard() {
    toast.dismiss();
    setFormDisabled(true);
    if (handoverData === defaultData) {
      toast.error("No changes yet, nothing to discard.", {
        duration: toastDuration,
      });
      setFormDisabled(false);
      return;
    }

    toast(
      <ToastMessage
        message="Are you sure to discard all changes?"
        textConfirmButton="Yes, discard please."
        messageAfterConfirm="Form reset to last saved version."
        textCancelButton="No, don&rsquo;t discard!"
        messageAfterCancel="Nothing changed."
        onConfirm={() => {
          setHandoverData(defaultData);
          setFormDisabled(false);
        }}
        onCancel={() => {
          setFormDisabled(false);
        }}
      />,
      { duration: Infinity }
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    toast.dismiss();
    setFormDisabled(true);

    if (handoverData === defaultData) {
      toast.error("No changes yet, nothing to save.", {
        duration: toastDuration,
      });
      setFormDisabled(false);
      return;
    }

    if (!validateTripDates(handoverData)) {
      toast.error("End date earlier than start date.", {
        duration: toastDuration,
      });
      setFormDisabled(false);
      return;
    }

    toast(
      <ToastMessage
        message="Are you sure to save all changes?"
        textConfirmButton="Yes, save please."
        messageAfterConfirm="Data successfully saved."
        textCancelButton="No, don&rsquo;t save."
        messageAfterCancel="Data not saved."
        onConfirm={() => {
          onSubmit(handoverData);
          setFormDisabled(false);
        }}
        onCancel={() => {
          setFormDisabled(false);
        }}
      />,
      { duration: Infinity }
    );
  }

  return (
    <TripForm
      aria-label="trip form"
      onSubmit={handleSubmit}
      formDisabled={formDisabled}
    >
      <Label htmlFor="destination">Destination</Label>
      <Input
        id="destination"
        name="destination"
        type="text"
        value={handoverData?.destination || ""}
        onInput={handleInput}
        required
        disabled={formDisabled}
        autoFocus
      />
      <DateContainer>
        <Label htmlFor="start">Start</Label>
        <Input
          id="start"
          name="start"
          type="date"
          value={formatDateForInput(handoverData?.start || "")}
          onInput={handleInput}
          required
          disabled={formDisabled}
        />
        <Label htmlFor="end">End</Label>
        <Input
          id="end"
          name="end"
          type="date"
          value={formatDateForInput(handoverData?.end || "")}
          onInput={handleInput}
          required
          disabled={formDisabled}
        />
      </DateContainer>
      <Label htmlFor="imageURL">Image URL</Label>
      <Input
        id="imageURL"
        name="imageURL"
        type="text"
        value={handoverData?.imageURL || ""}
        onInput={handleInput}
        disabled={formDisabled}
      />
      <PackListContainer>
        <Label htmlFor="packingList">Packing List</Label>
        <PackList>
          {handoverData?.packingList?.map((item, index) => (
            <InputContainer key={index}>
              <InputItem
                id={`packingList_${index}`}
                name={`packingList_${index}`}
                type="text"
                value={item.itemName}
                onChange={(event) =>
                  handleUpdateItem(index, event.target.value, item.itemQuantity)
                }
                disabled={formDisabled}
                required
              />
              <InputQuantity
                id={`packingList_quantity_${index}`}
                name={`packingList_quantity_${index}`}
                type="number"
                value={item.itemQuantity}
                onChange={(event) =>
                  handleUpdateItem(
                    index,
                    item.itemName,
                    Math.max(1, parseInt(event.target.value))
                  )
                }
                disabled={formDisabled}
                min="1"
                required
              />
              <StyledMiniButton
                type="button"
                defaultColor={"var(--color-delete-button)"}
                hoverColor={"var(--color-delete-button-hover)"}
                textColor={"var(--color-delete-button-text)"}
                onClick={() => handleRemoveItem(index)}
                disabled={formDisabled}
              >
                X
              </StyledMiniButton>

              {index === handoverData.packingList.length - 1 && (
                <StyledMiniButton
                  type="button"
                  defaultColor={"var(--color-add-button)"}
                  hoverColor={"var(--color-add-button-hover)"}
                  textColor={"var(--color-add-button-text)"}
                  fontSize={"1.4rem"}
                  onClick={handleAddItem}
                  disabled={formDisabled}
                >
                  +
                </StyledMiniButton>
              )}
            </InputContainer>
          ))}
        </PackList>
      </PackListContainer>
      <Label htmlFor="notes">Notes</Label>
      <Input
        id="notes"
        name="notes"
        type="text"
        value={handoverData?.notes || ""}
        onInput={handleInput}
        disabled={formDisabled}
      />
      <ButtonContainer>
        <StyledTextButton
          type="button"
          onClick={isEditMode ? handleDiscard : handleReset}
          disabled={formDisabled}
        >
          {isEditMode ? "Discard" : "Reset"}
        </StyledTextButton>
        <StyledTextButton type="submit" disabled={formDisabled}>
          Save
        </StyledTextButton>
      </ButtonContainer>
    </TripForm>
  );
}
