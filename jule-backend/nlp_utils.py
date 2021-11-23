import textstat

# setting language support to german
textstat.set_lang('de')

# TODO: add statistics
def calculate_statistics(text):

    statistics = dict()

    syllable_count = textstat.syllable_count(text)

    statistics['syllable_count'] = syllable_count

    return statistics