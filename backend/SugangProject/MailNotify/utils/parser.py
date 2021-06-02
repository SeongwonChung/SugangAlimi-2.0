## parser
def handle_apply(text):
    if text == "":
        return None
    return int(text)


def handle_limit(text):
    if text == "0" or text == "-":
        return None
    if "+" in text:
        limit, extra = map(int, text.split("+"))
        limit += extra
        return limit
    return int(text)


def handle_grade(text):
    if text == "1학년":
        return "1"
    if text == "2학년":
        return "2"
    if text == "3학년":
        return "3"
    if text == "4학년":
        return "4"
    if text == "교환학생":
        return "ex"
    if text == "대학원생":
        return "grad"
    if text == "전체":
        return "total"