import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Field } from '../components/Field';

beforeEach(()=>{
    render(<Field/>);
})

describe("UI", () => {
    test("Result field is visible", async()=>{
        expect(await screen.findByTestId("result-field")).toBeVisible();
    });
    describe("All calculator buttons are visible", ()=>{
        const buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-", "*", "/", ".", "=", "AC", "±"];
        test.each(buttons)("Button '%s' is visible", async(btn)=>{
            const button = await screen.findByTestId(`Button-${btn}`);
            expect(button).toBeVisible();
        });        
    })
})

describe("Click number button => number appears in result field", () =>{
    const buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
    test.each(buttons)("Click button '%s'", async(btn)=>{
        fireEvent.click(await screen.findByTestId(`Button-${btn}`));        
        expect(await screen.findByTestId(`result-field`)).toHaveValue(`${btn}`);
    });
});

test("Clear button clears result field", async()=>{
    fireEvent.click(await screen.findByTestId("Button-1"));
    fireEvent.click(await screen.findByTestId("Button-AC"));
    expect(await screen.findByTestId(`result-field`)).toHaveValue("0");
});

describe("Sign button", () => {
    test("Sign button changes sign of number", async()=>{
        fireEvent.click(await screen.findByTestId("Button-1"));
        fireEvent.click(await screen.findByTestId("Button-±"));
        expect(await screen.findByTestId(`result-field`)).toHaveValue("-1");
        fireEvent.click(await screen.findByTestId("Button-±"));
        expect(await screen.findByTestId(`result-field`)).toHaveValue("1");
    });
});

describe("Dot button", ()=>{
    test("Dot button adds a dot to the number => 1.", async()=>{
        fireEvent.click(await screen.findByTestId("Button-1"));
        fireEvent.click(await screen.findByTestId("Button-."));
        expect(await screen.findByTestId(`result-field`)).toHaveValue("1.");
    });
    test("There is 0 in result field, click dot button => 0.", async()=>{
        fireEvent.click(await screen.findByTestId("Button-."));
        expect(await screen.findByTestId(`result-field`)).toHaveValue("0.");
    });
    test("The number can has only one dot", async()=>{
        fireEvent.click(await screen.findByTestId("Button-5"));
        fireEvent.click(await screen.findByTestId("Button-."));
        fireEvent.click(await screen.findByTestId("Button-."));
        expect(await screen.findByTestId(`result-field`)).toHaveValue("5.");
        fireEvent.click(await screen.findByTestId("Button-6"));
        fireEvent.click(await screen.findByTestId("Button-7"));
        fireEvent.click(await screen.findByTestId("Button-."));
        expect(await screen.findByTestId(`result-field`)).toHaveValue("5.67");
    });
})


describe("Arithmetic functions", () => {    
    test("9 + 1 = 10", async () => {
        fireEvent.click(await screen.findByTestId("Button-9"));
        fireEvent.click(await screen.findByTestId("Button-+"));
        fireEvent.click(await screen.findByTestId("Button-1"));
        fireEvent.click(await screen.findByTestId("Button-="));

        expect(await screen.findByTestId("result-field")).toHaveValue("10");
    });

    test("5 - 8 = -3", async () => {
        fireEvent.click(await screen.findByTestId("Button-5"));
        fireEvent.click(await screen.findByTestId("Button--"));
        fireEvent.click(await screen.findByTestId("Button-8"));
        fireEvent.click(await screen.findByTestId("Button-="));

        expect(await screen.findByTestId("result-field")).toHaveValue("-3");
    });

    test("2 * 4 = 8", async () => {
        fireEvent.click(await screen.findByTestId("Button-2"));
        fireEvent.click(await screen.findByTestId("Button-*"));
        fireEvent.click(await screen.findByTestId("Button-4"));
        fireEvent.click(await screen.findByTestId("Button-="));

        expect(await screen.findByTestId("result-field")).toHaveValue("8");
    });

    test("6 / 3 = 2", async () => {
        fireEvent.click(await screen.findByTestId("Button-6"));
        fireEvent.click(await screen.findByTestId("Button-/"));
        fireEvent.click(await screen.findByTestId("Button-3"));
        fireEvent.click(await screen.findByTestId("Button-="));

        expect(await screen.findByTestId("result-field")).toHaveValue("2");
    });
    test("7 / 0 = NaN", async () => {
        fireEvent.click(await screen.findByTestId("Button-7"));
        fireEvent.click(await screen.findByTestId("Button-/"));
        fireEvent.click(await screen.findByTestId("Button-0"));
        fireEvent.click(await screen.findByTestId("Button-="));

        expect(await screen.findByTestId("result-field")).toHaveValue("NaN");
    });
    test("Permorm continues after the equal button was clicked", async () => {
        fireEvent.click(await screen.findByTestId("Button-8"));
        fireEvent.click(await screen.findByTestId("Button-/"));
        fireEvent.click(await screen.findByTestId("Button-4"));
        fireEvent.click(await screen.findByTestId("Button-="));
        fireEvent.click(await screen.findByTestId("Button-+"));
        fireEvent.click(await screen.findByTestId("Button-6"));
        fireEvent.click(await screen.findByTestId("Button--"));
        expect(await screen.findByTestId("result-field")).toHaveValue("8");

        fireEvent.click(await screen.findByTestId("Button-1"));
        fireEvent.click(await screen.findByTestId("Button-0"));
        fireEvent.click(await screen.findByTestId("Button--"));
        expect(await screen.findByTestId("result-field")).toHaveValue("-2");

        fireEvent.click(await screen.findByTestId("Button-1"));
        fireEvent.click(await screen.findByTestId("Button-6"));
        fireEvent.click(await screen.findByTestId("Button-="));
        expect(await screen.findByTestId("result-field")).toHaveValue("-18");
    });
    test("The action of the last clicked arithmetic button is performed", async () => {
        fireEvent.click(await screen.findByTestId("Button-7"));
        fireEvent.click(await screen.findByTestId("Button-/"));
        fireEvent.click(await screen.findByTestId("Button-*"));
        fireEvent.click(await screen.findByTestId("Button-+"));
        fireEvent.click(await screen.findByTestId("Button--"));
        fireEvent.click(await screen.findByTestId("Button-2"));
        fireEvent.click(await screen.findByTestId("Button-="));

        expect(await screen.findByTestId("result-field")).toHaveValue("5");
    });
    test("It doesn't matter how many times you clicked the arithmetic button in a row", async () => {
        fireEvent.click(await screen.findByTestId("Button-2"));
        fireEvent.click(await screen.findByTestId("Button-+"));
        fireEvent.click(await screen.findByTestId("Button-+"));
        fireEvent.click(await screen.findByTestId("Button-+"));
        fireEvent.click(await screen.findByTestId("Button-0"));
        fireEvent.click(await screen.findByTestId("Button-="));

        expect(await screen.findByTestId("result-field")).toHaveValue("2");
    });
});
