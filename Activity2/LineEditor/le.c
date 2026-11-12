
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#define MAX_LINE 1000
#define MAX_LINES 1000

char *document[MAX_LINES];
int lineCount = 0;

// Read a string safely
void readInput(char *str, int size) {
    if (fgets(str, size, stdin) != NULL) {
        str[strcspn(str, "\n")] = '\0';
    }
}

// Insert a line
void insertLine() {
    int pos;
    char text[MAX_LINE];

    printf("Enter line number: ");
    scanf("%d", &pos);
    getchar();

    if (pos < 1 || pos > lineCount + 1 || lineCount >= MAX_LINES) {
        printf("Invalid position or document full!\n");
        return;
    }

    printf("Enter text: ");
    readInput(text, MAX_LINE);

    for (int i = lineCount; i >= pos; i--) {
        document[i] = document[i - 1];
    }

    document[pos - 1] = malloc(strlen(text) + 1);

    if (document[pos - 1] == NULL) {
        for (int i = pos - 1; i < lineCount; i++) {
            document[i] = document[i + 1];
        }
        printf("Memory allocation failed!\n");
        return;
    }

    strcpy(document[pos - 1], text);
    lineCount++;

    printf("Line inserted successfully!\n");
}

// Delete a line
void deleteLine() {
    int pos;

    printf("Enter line number to delete: ");
    scanf("%d", &pos);
    getchar();

    if (pos < 1 || pos > lineCount) {
        printf("Invalid line number!\n");
        return;
    }

    free(document[pos - 1]);

    for (int i = pos - 1; i < lineCount - 1; i++) {
        document[i] = document[i + 1];
    }

    lineCount--;

    printf("Line deleted successfully!\n");
}

// Display document
void displayDocument() {
    if (lineCount == 0) {
        printf("Document is empty!\n");
        return;
    }

    printf("\n----- DOCUMENT -----\n");

    for (int i = 0; i < lineCount; i++) {
        printf("%d. %s\n", i + 1, document[i]);
    }

    printf("--------------------\n");
}

// Save document
void saveFile() {
    char filename[100];

    printf("Enter filename: ");
    readInput(filename, sizeof(filename));

    FILE *fp = fopen(filename, "w");

    if (fp == NULL) {
        printf("Unable to open file!\n");
        return;
    }

    for (int i = 0; i < lineCount; i++) {
        fprintf(fp, "%s\n", document[i]);
    }

    fclose(fp);

    printf("File saved successfully!\n");
}

// Load document
void loadFile() {
    char filename[100];
    char text[MAX_LINE];

    printf("Enter filename: ");
    readInput(filename, sizeof(filename));

    FILE *fp = fopen(filename, "r");

    if (fp == NULL) {
        printf("File not found!\n");
        return;
    }

    for (int i = 0; i < lineCount; i++) {
        free(document[i]);
    }

    lineCount = 0;

    while (fgets(text, MAX_LINE, fp) != NULL) {
        text[strcspn(text, "\n")] = '\0';

        if (lineCount >= MAX_LINES) {
            printf("Maximum line limit reached!\n");
            break;
        }

        document[lineCount] = malloc(strlen(text) + 1);

        if (document[lineCount] == NULL) {
            printf("Memory allocation failed!\n");
            break;
        }

        strcpy(document[lineCount], text);
        lineCount++;
    }

    fclose(fp);

    printf("File loaded successfully!\n");
}

// Search for a word
void searchWord() {
    char word[MAX_LINE];
    int found = 0;

    printf("Enter word to search: ");
    readInput(word, MAX_LINE);

    if (word[0] == '\0') {
        printf("Search word cannot be empty!\n");
        return;
    }

    for (int i = 0; i < lineCount; i++) {
        if (strstr(document[i], word) != NULL) {
            printf("Found in line %d: %s\n", i + 1, document[i]);
            found = 1;
        }
    }

    if (!found) {
        printf("Word not found!\n");
    }
}

// Replace text
void replaceWord() {
    char oldWord[MAX_LINE], newWord[MAX_LINE];

    printf("Enter word to replace: ");
    readInput(oldWord, MAX_LINE);

    printf("Enter replacement: ");
    readInput(newWord, MAX_LINE);

    if (oldWord[0] == '\0') {
        printf("Search word cannot be empty!\n");
        return;
    }

    int replacements = 0;
    size_t oldLen = strlen(oldWord);
    size_t newLen = strlen(newWord);

    for (int i = 0; i < lineCount; i++) {
        char *p = document[i];
        int count = 0;

        while ((p = strstr(p, oldWord)) != NULL) {
            count++;
            p += oldLen;
        }

        if (count == 0) {
            continue;
        }

        size_t newSize = strlen(document[i])
                       + count * ((newLen > oldLen) ? newLen - oldLen : 0)
                       - count * ((oldLen > newLen) ? oldLen - newLen : 0)
                       + 1;

        char *result = malloc(newSize);

        if (result == NULL) {
            printf("Memory allocation failed!\n");
            continue;
        }

        char *src = document[i];
        char *dest = result;

        while ((p = strstr(src, oldWord)) != NULL) {
            size_t len = p - src;

            memcpy(dest, src, len);
            dest += len;

            memcpy(dest, newWord, newLen);
            dest += newLen;

            src = p + oldLen;
        }

        strcpy(dest, src);

        free(document[i]);
        document[i] = result;

        replacements += count;
    }

    printf("%d replacement(s) made.\n", replacements);
}

// Count lines and words
void countWords() {
    int words = 0;

    for (int i = 0; i < lineCount; i++) {
        int inWord = 0;

        for (int j = 0; document[i][j] != '\0'; j++) {
            if (isspace((unsigned char)document[i][j])) {
                inWord = 0;
            } else if (!inWord) {
                words++;
                inWord = 1;
            }
        }
    }

    printf("Total lines: %d\n", lineCount);
    printf("Total words: %d\n", words);
}

// Free allocated memory
void freeDocument() {
    for (int i = 0; i < lineCount; i++) {
        free(document[i]);
    }
}

// Main function
int main() {
    int choice;

    do {
        printf("\n===== SIMPLE LINE EDITOR =====\n");
        printf("1. Insert Line\n");
        printf("2. Delete Line\n");
        printf("3. Display Document\n");
        printf("4. Save File\n");
        printf("5. Load File\n");
        printf("6. Search Word\n");
        printf("7. Find and Replace\n");
        printf("8. Word and Line Count\n");
        printf("9. Exit\n");

        printf("Enter choice: ");

        if (scanf("%d", &choice) != 1) {
            printf("Invalid input!\n");
            int ch;
            while ((ch = getchar()) != '\n' && ch != EOF);
            continue;
        }

        getchar();

        switch (choice) {
            case 1:
                insertLine();
                break;

            case 2:
                deleteLine();
                break;

            case 3:
                displayDocument();
                break;

            case 4:
                saveFile();
                break;

            case 5:
                loadFile();
                break;

            case 6:
                searchWord();
                break;

            case 7:
                replaceWord();
                break;

            case 8:
                countWords();
                break;

            case 9:
                printf("Exiting editor...\n");
                break;

            default:
                printf("Invalid choice!\n");
        }

    } while (choice != 9);

    freeDocument();

    return 0;
}
