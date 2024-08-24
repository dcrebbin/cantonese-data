public class CharacterSet
{
    public string Character { get; set; }
    public string Romanization { get; set; }
    public string Definition { get; set; }
    public int Index { get; set; }

    public CharacterSet(string character, string romanization, string definition)
    {
        Character = character;
        Romanization = romanization;
        Definition = definition;
    }
};