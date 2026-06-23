export var PersonalityTraits;
(function (PersonalityTraits) {
    PersonalityTraits[PersonalityTraits["silly"] = 0] = "silly";
    PersonalityTraits[PersonalityTraits["energetic"] = 1] = "energetic";
    PersonalityTraits[PersonalityTraits["lazy"] = 2] = "lazy";
})(PersonalityTraits || (PersonalityTraits = {}));
// personalities will be implemented through keywords which decide what behaviours an individual might perform and at what rate.
// example: a Fish with the "silly" trait may make funny noises more often.
