import countries from 'world-countries';


function printall()
{
    for (const c of countries)
    {
        console.log(c.name.common + " (" + c.cca3 + ")");
    }
}

function IsBordering(targetCountry, tester) {
    if (targetCountry === tester)
    {
        return false;
    }
    let borders;
    let abbrev;
    for (const c of countries) //Extract borders of target and abbreviation of tester
    {
        if (c.name.common.toLowerCase() === targetCountry.toLowerCase())
        {
            borders = c.borders;
        }
        if (c.name.common.toLowerCase() === tester.toLowerCase())
        {
            abbrev = c.cca3;
        }
    }

    if (!borders || !abbrev) 
    {
    return false;
    }

    for (const b of borders) //check abbreviation is in borders array
    {
        if (b === abbrev)
        {
            return true;
        }
    }
    return false;
}

export default IsBordering;
